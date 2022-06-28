//COMPONENTS
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import End from "./components/GameOver";
//CSS
import "./css/App.css";
//REACT
import { useCallback, useEffect, useState } from "react";
//DATA
import { wordsList } from "./data/words";
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  //letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState([]);
  //letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);
  //tentativas do user
  const [guesses, setGuesses] = useState(guessesQty);
  //pontuação do user
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pegando a categoria aleatória
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pegando a letra aleatória
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //função para startar o jogo
  const startGame = useCallback(() => {
    //limpa todos os states de letras
    clearLetterStates();
    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setLetters(wordLetters);
    setPickedCategory(category);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //função para verificar a letra do input
  const verifyLetter = (letter) => {
    //padronizando o que está vindo do input
    let normalizedLetter = letter.toLowerCase();

    // verificando se a letra já foi utilizada ou não
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //guessedLetters or remove a guesses --
    //estou unindo o elemento ao array
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        //pegando todos os elementos do array
        ...actualGuessedLetters,
        //adicionando a nova letra
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        //pegando todos os elementos do array atuais e colocando o novo
        ...actualWrongLetters,
        //adicionando a nova letra
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
  //verifico se as tentivas terminaram
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //verificando se ganhou
  useEffect(() => {
    //um array de letras unicas, o Set, ele só deixa itens únicos em um array
    const uniqueLetters = [...new Set(letters)];

    //condição para verificar vitória
    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].name
    ) {
      //adicionando pontuação

      setScore((actualScore) => (actualScore += 100));
      //restartando o game com uma nova palavra;
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  //função para resetar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <End retry={retry} score={score} />}
    </div>
  );
}

export default App;
