import "../css/GameOver.css";

const End = ({ retry, score }) => {
  return (
    <div>
      <h1>Fim de jogo!</h1>
      <h2>
        A sua potuação foi: <span>{score}</span>
      </h2>
      <button onClick={retry}>Resetar jogo</button>
    </div>
  );
};

export default End;
