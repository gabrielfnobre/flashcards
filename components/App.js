const { useEffect: useEffectApp, useState: useStateApp, useCallback: useCallbackApp } = React;

/**
 * Componente raiz da SPA: gerencia grupos, cards, estado de estudo e integração com a API.
 */
window.App = () => {
  const [groups, setGroups] = useStateApp([]);
  const [selectedGroup, setSelectedGroup] = useStateApp(null);
  const [cards, setCards] = useStateApp([]);
  const [displayCards, setDisplayCards] = useStateApp([]);
  const [currentIndex, setCurrentIndex] = useStateApp(0);
  const [shuffleOn, setShuffleOn] = useStateApp(true);
  const [status, setStatus] = useStateApp(null);
  const [loadingCards, setLoadingCards] = useStateApp(false);

  const loadGroups = useCallbackApp(async () => {
    try {
      const data = await fetchJson(window.API_BASE + "?action=list_groups");
      setGroups(data.groups || []);
      if (!selectedGroup && data.groups?.length) {
        setSelectedGroup(data.groups[0]);
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  }, [selectedGroup]);

  const loadCards = useCallbackApp(async (groupId) => {
    if (!groupId) return;
    setLoadingCards(true);
    try {
      const data = await fetchJson(window.API_BASE + "?action=list_cards&group_id=" + groupId);
      setCards(data.cards || []);
      setCurrentIndex(0);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoadingCards(false);
    }
  }, []);

  useEffectApp(() => {
    loadGroups();
  }, [loadGroups]);

  useEffectApp(() => {
    if (selectedGroup) {
      loadCards(selectedGroup.id);
    } else {
      setCards([]);
    }
  }, [selectedGroup, loadCards]);

  useEffectApp(() => {
    const ordered = shuffleOn ? shuffleList(cards) : [...cards];
    setDisplayCards(ordered);
    setCurrentIndex(0);
  }, [cards, shuffleOn]);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setStatus(null);
  };

  const handlePrev = () => {
    setCurrentIndex((idx) => (idx - 1 + displayCards.length) % displayCards.length);
  };

  const handleNext = () => {
    setCurrentIndex((idx) => (idx + 1) % displayCards.length);
  };

  const handleEditCard = async (id, updates) => {
    try {
      const data = await fetchJson(window.API_BASE + "?action=update_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const updated = data.card;
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setStatus({ type: "success", message: "Card atualizado." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await fetchJson(window.API_BASE + "?action=delete_card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCards((prev) => prev.filter((c) => c.id !== id));
      setStatus({ type: "success", message: "Card removido." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await fetchJson(window.API_BASE + "?action=delete_group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setGroups((prev) => prev.filter((g) => g.id !== id));
      if (selectedGroup && selectedGroup.id === id) {
        const remaining = groups.filter((g) => g.id !== id);
        setSelectedGroup(remaining[0] || null);
        setCards([]);
      }
      setStatus({ type: "success", message: "Grupo removido." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return e(
    "div",
    { className: "pb-10" },
    e(Header),
    e(
      "div",
      { className: "max-w-6xl mx-auto px-6" },
      e(
        "div",
        { className: "grid grid-cols-1 lg:grid-cols-3 gap-5" },
        e(
          "div",
          { className: "space-y-4" },
          e(GroupForm, {
            onCreated: (g) => {
              setGroups((prev) => [g, ...prev]);
              setSelectedGroup(g);
            },
          }),
          e(GroupList, {
            groups,
            selectedId: selectedGroup?.id,
            onSelect: handleSelectGroup,
            onDeleteGroup: handleDeleteGroup,
          }),
          e(CardForm, { group: selectedGroup, onCreated: (card) => setCards((prev) => [card, ...prev]) }),
          e(Status, { status })
        ),
        e(
          "div",
          { className: "lg:col-span-2" },
          loadingCards
            ? e(
                "div",
                {
                  className:
                    "flex items-center justify-center min-h-[70vh] bg-panel/70 border border-slate-800 rounded-3xl",
                },
                e("p", { className: "text-slate-400" }, "Carregando cards...")
              )
            : e(FlashcardViewer, {
                cards: displayCards,
                currentIndex,
                onPrev: handlePrev,
                onNext: handleNext,
                shuffleOn,
                onShuffleToggle: setShuffleOn,
                onEditCard: handleEditCard,
                onDeleteCard: handleDeleteCard,
              })
        )
      )
    )
  );
};
