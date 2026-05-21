-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23/04/2026 às 15:26
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

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
  `question_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cards`
--

INSERT INTO `cards` (`id`, `group_id`, `question`, `answer`, `answer_image`, `question_image`, `created_at`) VALUES
(1, 1, 'Por que o Java pode ser comparado a uma matrioska?', NULL, 'photos/card_6942780967555.png', NULL, '2025-12-17 09:29:45'),
(4, 1, 'O que é o JDK?', 'O JDK (Java Development Kit) é o kit de ferramentas essencial para qualquer pessoa que deseja desenvolver aplicações em Java. Pense nele como uma \"caixa de ferramentas\" completa que contém tudo o que um programador precisa para escrever, compilar e testar código Java. Ele contém o JVM e JRE.', NULL, NULL, '2025-12-19 08:39:50'),
(5, 1, 'O JDK não é um programa único, na realidade ele é dividido em 3 pilares: Ferramentas de Desenvolvimento, JRE e as Bibliotecas de Classe. Explique o que são \"As Ferramentas de Desenvolvimento\"', 'Ferramentas de Desenvolvimento: Programas de linha de comando que você usa para manipular seu código. Os principais são:\r\n* javac: O compilador que transforma seu código fonte (.java) em bytecode (.class).\r\n* jar: Ferramenta para empacotar seus arquivos em um único arquivo comprimido.\r\n* javadoc: Gerador automático de documentação a partir dos comentários do código.\r\n* jdb: Um depurador (debugger) para encontrar erros.\r\n* jvm: Máquina Virtual Java que lê o bytecode e traduz para a linguagem do seu computador.', NULL, NULL, '2025-12-19 08:46:20'),
(6, 1, 'O JDK não é um programa único, na realidade ele é dividido em 3 pilares: Ferramentas de Desenvolvimento, JRE e as Bibliotecas de Classe. Explique o que é \"As Bibliotecas de Classe\"', 'Um vasto conjunto de códigos pré-escritos que lidam com tarefas comuns (como ler arquivos, conectar à internet ou criar listas), evitando que você tenha que \"reinventar a roda\".', NULL, NULL, '2025-12-19 09:18:01'),
(7, 1, 'O que é o JRE?', 'JRE (Java Runtime Environment): O ambiente de execução. Se o JDK é para criar, o JRE é para rodar. O JDK já vem com um JRE embutido para que você possa testar o que acabou de programar.', NULL, NULL, '2025-12-19 09:18:56'),
(8, 1, 'Qual é o nome do compilador do java e como ele trabalha?', 'O nome do compilador do java é o \"javac\", ele trabalha da seguinte forma: ele transforma o código \".java\" que está em auto-nível em \"bytecode\". Para isso ele verifica semântica e sintatica da linguagem para poder compilar o código para bytecode para que possa ser lido por uma JVM.', NULL, NULL, '2026-04-23 12:21:58'),
(9, 1, 'O que é o bytecode?', 'O \"bytecode\" é um arquivo \".class\" onde está armazenado o conjunto de instruções para que a JVM possa executar a aplicação java. Por estar em bytecode, não importa o processador físico (AMD, Intell) ou sistema operacional (Linux, Windows), o código vai rodar.', NULL, NULL, '2026-04-23 12:26:48'),
(10, 1, 'O que é a JVM?', 'A JVM ou Java Virtual Machine é o interpretador de bytecode do java. O trabalho dele é servir de tradutor entre as instruções vindas do bytecode para a linguagem de máquina que o Sistema Operacional e o processador usam. Para isso, temos uma JVM específica para casa Sistema Operacional.', NULL, NULL, '2026-04-23 12:31:31'),
(11, 1, 'O que o JIT?', 'O JIT ou \"Just-In-Time\" do java é um processo just in time (semelhante ao de logística e produção industrial) que a JVM usa para agilizar o processo de interpretação de bytecode para linguagem de máquina.\r\nEm vez de traduzir as instruções camada a camada, o JIT armazena na memória camadas de código que são parecidas ou fazem a mesma coisa para não precisar interpretá-las novamente. Assim ele aproveita melhor o tempo e faz uma interpretação mais rápida.', NULL, NULL, '2026-04-23 12:36:20'),
(12, 1, 'Como funciona a memória Stack?', 'A memória Stack (Pilha) é a memória rápida do java. Essa memória é usada para armazenar poucas coisas, pois, por ser rápida ela tem menos armazenamento e mais velocidade.\r\nEla é usada para armazenar valores de variáveis dentro de estruturas de bloco (for, métodos, while) e referências a objetos que estão na memória Heap.\r\nEla é organizada e veloz, mas possuí tamanho limitado. Quando acaba sua memória dá o famoso \"stackOverFlowError\", sinalizando que a memória foi usada além do limite. Seu estilo de pilha é LIFO.', NULL, NULL, '2026-04-23 12:59:42'),
(13, 1, 'Explique como funciona a Memória Heap.', 'Memória Heap (\"Amontoado\"), é a memória gigante do java, ela é o contrário da Stack, ela é desorganizada, muito grande e lenta para acessar.\r\nNela ficam os grandes objetos do java como classes, instâncias e métodos. Eles ficam lá enquanto existir uma referência à eles na aplicação.\r\nEmbora seja mais desorganizada que a Stack, ela não é uma bagunça total. Pois nela a alocação é feita de forma dinâmica, onde ela separa objetos de instância que são sempre referenciados para estarem em fácil acesso, objetos usados com frequência, objetos usados esporádicamente, objetos que quase nunca são usados. O garbage collector é responsável por essa organização na Heap e pela limpeza dela. Apesar de ser gigante, ela não é infinita, se o desenvolvedor armazenar muitas variáveis de instancia poderá lotar a Heap e causar um OutOfMemoryError.', NULL, NULL, '2026-04-23 13:08:37');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
