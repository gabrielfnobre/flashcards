-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 20/12/2025 às 10:32
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `flashcards_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cards`
--

CREATE TABLE `cards` (
  `id` int(10) UNSIGNED NOT NULL,
  `group_id` int(10) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `answer` mediumtext DEFAULT NULL,
  `answer_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cards`
--

INSERT INTO `cards` (`id`, `group_id`, `question`, `answer`, `answer_image`, `created_at`) VALUES
(1, 1, 'Por que o Java pode ser comparado a uma matrioska?', NULL, 'photos/card_6942780967555.png', '2025-12-17 09:29:45'),
(4, 1, 'O que é o JDK?', 'O JDK (Java Development Kit) é o kit de ferramentas essencial para qualquer pessoa que deseja desenvolver aplicações em Java. Pense nele como uma \"caixa de ferramentas\" completa que contém tudo o que um programador precisa para escrever, compilar e testar código Java. Ele contém o JVM e JRE.', NULL, '2025-12-19 08:39:50'),
(5, 1, 'O JDK não é um programa único, na realidade ele é dividido em 3 pilares: Ferramentas de Desenvolvimento, JRE e as Bibliotecas de Classe. Explique o que são \"As Ferramentas de Desenvolvimento\"', 'Ferramentas de Desenvolvimento: Programas de linha de comando que você usa para manipular seu código. Os principais são:\r\n* javac: O compilador que transforma seu código fonte (.java) em bytecode (.class).\r\n* jar: Ferramenta para empacotar seus arquivos em um único arquivo comprimido.\r\n* javadoc: Gerador automático de documentação a partir dos comentários do código.\r\n* jdb: Um depurador (debugger) para encontrar erros.\r\n* jvm: Máquina Virtual Java que lê o bytecode e traduz para a linguagem do seu computador.', NULL, '2025-12-19 08:46:20'),
(6, 1, 'O JDK não é um programa único, na realidade ele é dividido em 3 pilares: Ferramentas de Desenvolvimento, JRE e as Bibliotecas de Classe. Explique o que é \"As Bibliotecas de Classe\"', 'Um vasto conjunto de códigos pré-escritos que lidam com tarefas comuns (como ler arquivos, conectar à internet ou criar listas), evitando que você tenha que \"reinventar a roda\".', NULL, '2025-12-19 09:18:01'),
(7, 1, 'O que é o JRE?', 'JRE (Java Runtime Environment): O ambiente de execução. Se o JDK é para criar, o JRE é para rodar. O JDK já vem com um JRE embutido para que você possa testar o que acabou de programar.', NULL, '2025-12-19 09:18:56'),
(8, 1, 'O que é o JIT da JVM?', 'O JIT é por assim dizer o \"motor turbo\" da JVM para interpretar bytecode para a linguagem do computador. Signfica \"Just-In-Time\", ele usa do conceito de just-in-time para acelar o processo de tradução, fazendo com que o código java possa ser traduzido de forma rápida e eficiente. Usa também o conceito de hot-spots, que são trechos de código que se repetem, guardando esses trechos em cache da JVM e chamando-os quando necessário, em vez de traduzir.', NULL, '2025-12-20 07:29:26'),
(9, 1, 'Me explique o que é e como o Java usa \"Memória Stack\"?', 'A Memória Stack funciona como uma pilha de pratos. O que são empilhados nela são os métodos e objetos temporários usados no java. Por exemplo, objetos criados a partir de uma classe, variáveis e coisas do tipo. O último método a entrar é o primeiro a sair (LIFO - Last In First Out). Assim que um método termina (return), tanto ele quanto tudo que estava ligado a ele na Stack é apagado da memória.', NULL, '2025-12-20 08:33:11'),
(10, 1, 'Me explique o que é - e como o Java usa - \"Memória Heap\"?', 'A memória Heap (Amontoado, Monte) traz a ideia de um \"galpão de armazenamento\". É uma área grande e \"bagunçada\" onde todos os dados vivos ficam (dados que estão sendo usados com frequência). Lá estão dados raiz, como as classes, além de métodos e variáveis que estão sendo usados com frequência. O Garbage Collector que os leva para lá ao perceber que estão sendo muito utilizados. O GC passa com menos frequência pela Heap em relação a Stack, quando ele passa ele excluí os dados que estiverem ociosos.', NULL, '2025-12-20 08:42:43'),
(11, 1, 'O que é o \"Garbage Collector\"? E qual a sua importância?', 'O Garbage Collector (GC) é o faxineiro inteligente do java. O problema das memórias Stack e Heap é que ela enchem, se ninguém limpar, dá o temido erro OutOfMemoryError. É aí que entra o GC, ele trabalha em segundo plano com uma estratégia chamada \"Hipótese Geracional\", onde ele assume que todo objeto morre jovem, ou seja, é usado rapidinho e descartado, ele usa essa temática para descartar ou manter objetos na memória.', NULL, '2025-12-20 08:47:58'),
(12, 1, 'Como funciona o estratégia de \"Hipótese Geracional\" do Garbage Collector?', 'A \"Hipótese Geracional\" é uma estratégia usada pelo Garbage Collector ao limpar a Memória Heap, onde ele assume que \"a maioria dos objetos morre jovem\" (são usados rapidinho e descartados). O processo funciona assim:\r\n\r\nEden (O Berçário): É o estado em que todo objeto novo nasce para o CG, usando um processo chamado \"Minor GC\" (A Limpeza Leve) ele passa de tempos em tempos no Eden e faz a seguinte comparação: \r\n- \"Quem não está sendo usado?\" \r\n- Lixo! \"\r\n- \"Quem está sendo usado?\" \r\n- É marcado como Sobrevivente.\r\n\r\nOld Generation (O Asilo): Se um objeto sobrevive a várias Minor GC, o CG entende que ele é importante e o move para a \"Old Generation\".', NULL, '2025-12-20 08:56:23'),
(13, 1, 'O que é o processo de \"Mark and Sweep\" do Garbage Collector?', 'O Algoritmo: Mark and Sweep (Marcar e Varrer) É usado pelo CG como uma técnica de \"fio de Ariadne\":\r\n\r\nMark (Marcar): Ele começa pelas raízes (variáveis ativas na Stack) e vai seguindo todas as referências. \"Esse objeto aponta para aquele, que aponta para aquele...\". Tudo que ele consegue alcançar, ele marca como \"Vivo\".\r\n\r\nSweep (Varrer): Tudo que não foi marcado (ou seja, está isolado na ilha da memória sem ninguém apontando para ele) é considerado lixo e varrido da memória.', NULL, '2025-12-20 08:59:55'),
(14, 1, 'Oque é o \"Vazamento de Memória\" do Java?', 'Vazamento de Memória (Memory Leak): Mesmo com GC, você pode ter vazamentos. Se você colocar um objeto numa lista estática (Global) que ocupe muito espaço e esquecer dela, o GC nunca vai apagá-la porque ele ainda tem uma referência ativa. Isso impacta sob a Performance: O GC às vezes precisa pausar seu programa para limpar a bagunça (chamado de \"Stop The World\"). Se você criar objetos demais desnecessariamente, seu programa vai engasgar, gerando o temido vazamento de dados, ou pior, OutOfMemoryError.', NULL, '2025-12-20 09:04:52');

-- --------------------------------------------------------

--
-- Estrutura para tabela `groups`
--

CREATE TABLE `groups` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `groups`
--

INSERT INTO `groups` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Fundamentos do Java', NULL, '2025-12-17 09:28:43');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cards_group` (`group_id`);

--
-- Índices de tabela `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `fk_cards_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
