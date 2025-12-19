-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 19/12/2025 às 10:27
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
(7, 1, 'O que é o JRE?', 'JRE (Java Runtime Environment): O ambiente de execução. Se o JDK é para criar, o JRE é para rodar. O JDK já vem com um JRE embutido para que você possa testar o que acabou de programar.', NULL, '2025-12-19 09:18:56');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
