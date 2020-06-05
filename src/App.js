import React, { PureComponent } from "react";
import Header from "./components/header/Header";
import Card from "./components/card/Card";
import GameOver from "./components/card/GameOver";

import "./styles/main.css";

class App extends PureComponent {
  state = {
    isFlipped: Array(16).fill(false),
    shuffledCard: App.duplicateCard().sort(() => Math.random() - 0.5), // sort it randomly
    clickCount: 1,
    prevSelectedCard: -1, // value
    prevCardId: -1, // position
    FlippedArray: [],
    NumberOfPlayer: 0,
    score: [0, 0],
    last2Cards: [],
  };

  // [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7]
  static duplicateCard = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].reduce(
      (preValue, current, index, array) => {
        return preValue.concat([current, current]);
      },
      []
    );
  };

  static SpecialduplicateCard = (num) => {
    return [...Array(num).keys()].reduce((preValue, current, index, array) => {
      return preValue.concat([current, current]);
    }, []);
  };

  handleClick = (event) => {
    console.log("player number:", this.state.NumberOfPlayer);
    //event.preventDefault();
    const cardId = event.target.id;
    const newFlipps = this.state.isFlipped.slice();
    this.setState({
      prevSelectedCard: this.state.shuffledCard[cardId], // the value
      prevCardId: cardId, // the position
    });

    // Try to flip card that doesnt have match yet
    if (newFlipps[cardId] === false) {
      console.log("newFlipps[cardId]:", newFlipps[cardId]);
      newFlipps[cardId] = !newFlipps[cardId];
      var newPlayerNumber = (this.state.NumberOfPlayer + 1) % 2;
      this.setState((prevState) => ({
        isFlipped: newFlipps,
        clickCount: this.state.clickCount + 1,
      }));

      // Flipped the second card
      if (this.state.clickCount === 2) {
        this.setState({ clickCount: 1 });
        const prevCardId = this.state.prevCardId; // position
        const newCard = this.state.shuffledCard[cardId]; // value
        const previousCard = this.state.prevSelectedCard; // value of prev
        console.log(
          "Flipped the second card",
          previousCard,
          newCard,
          prevCardId,
          cardId
        );
        this.isCardMatch(previousCard, newCard, prevCardId, cardId);
        // end turn of the player
        this.setState({
          NumberOfPlayer: newPlayerNumber,
        });
      }
    }
  };

  isCardMatch = (card1, card2, card1Id, card2Id) => {
    if (card1 === card2) {
      // are the values equals
      //Change Flipped Array - contains all the flipped couples vales & position

      const newFlippArray = this.state.FlippedArray;
      newFlippArray.push([card1, card2, card1Id, card2Id]);
      this.setState({ FlippedArray: newFlippArray });

      const hideCard = this.state.shuffledCard.slice();
      hideCard[card1Id] = -1;
      hideCard[card2Id] = -1;
      const newScore = this.state.score;
      newScore[this.state.NumberOfPlayer] += 1;
      setTimeout(() => {
        this.setState((prevState) => ({
          shuffledCard: hideCard,
          score: newScore,
        }));
      }, 1000);
    } else {
      // arent equal
      const flipBack = this.state.isFlipped.slice();
      const newLast2Cards = [card1, card2, card1Id, card2Id];
      this.setState({
        last2Cards: newLast2Cards,
      });
      flipBack[card1Id] = false;
      flipBack[card2Id] = false;
      setTimeout(() => {
        this.setState((prevState) => ({ isFlipped: flipBack }));
      }, 1000);
    }
  };

  restartGame = () => {
    this.setState({
      isFlipped: Array(16).fill(false),
      shuffledCard: App.duplicateCard().sort(() => Math.random() - 0.5),
      clickCount: 1,
      prevSelectedCard: -1,
      prevCardId: -1,
      FlippedArray: [],
      NumberOfPlayer: 0,
      score: [0, 0],
    });
  };

  handleClickButton = (num) => {
    console.log("handleClickButton");
    this.setState({
      isFlipped: Array(num).fill(false),
      shuffledCard: App.SpecialduplicateCard(num / 2).sort(
        () => Math.random() - 0.5
      ),
      clickCount: 1,
      prevSelectedCard: -1,
      prevCardId: -1,
    });
    console.log(this.state);
  };

  handleClickUndo = () => {
    console.log("handleClickUndo", this.state.clickCount);
    if (this.state.clickCount == 1 && this.state.FlippedArray.length > 0) {
      var lastElement = this.state.FlippedArray.slice(-1)[0];
      console.log(this.state.FlippedArray);
      //card1, card2, card1Id, card2Id = lastElement;

      const hideCard = this.state.shuffledCard.slice();
      hideCard[lastElement[2]] = 1;
      hideCard[lastElement[3]] = 1;
      const newFlipps = this.state.isFlipped.slice();
      newFlipps[lastElement[2]] = !newFlipps[lastElement[2]];
      newFlipps[lastElement[3]] = !newFlipps[lastElement[3]];
      const NewNumberOfPlayer = this.state.NumberOfPlayer == 1 ? 0 : 1;
      setTimeout(() => {
        this.setState((prevState) => ({
          shuffledCard: hideCard,
          isFlipped: newFlipps,
          NumberOfPlayer: NewNumberOfPlayer,
        }));
      }, 1000);
      // clickCount=1
      // meaning I need to shift both cards back
      console.log(this.state.FlippedArray);
    } else if (
      this.state.clickCount == 1 &&
      this.state.FlippedArray.length == 0
    ) {
      console.log("handleClickUndo Array is 0 ");
      const NewNumberOfPlayer = this.state.NumberOfPlayer == 1 ? 0 : 1;
      const newFlipps = this.state.isFlipped.slice();
      newFlipps[this.state.last2Cards[2]] = !newFlipps[
        this.state.last2Cards[2]
      ];
      console.log(this.state);
      setTimeout(() => {
        this.setState((prevState) => ({
          isFlipped: newFlipps,
          NumberOfPlayer: NewNumberOfPlayer,
          clickCount: 2,
          prevCardId: this.state.last2Cards[2],
          prevSelectedCard: this.state.last2Cards[0],
        }));
      }, 1000);
    } else {
      // clickCount=2
      const newFlipps = this.state.isFlipped.slice();
      newFlipps[this.state.prevCardId] = !newFlipps[this.state.prevCardId];
      this.setState((prevState) => ({
        isFlipped: newFlipps,
        clickCount: 1,
      }));
    }
  };

  //check if all the board is true
  isGameOver = () => {
    return this.state.isFlipped.every(
      (element, index, array) => element !== false
    );
  };

  render() {
    //console.log(this.state.shuffledCard);
    return (
      <div>
        <Header
          restartGame={this.restartGame}
          handleClickButton={this.handleClickButton}
          handleClickUndo={this.handleClickUndo}
          score={this.state.score}
          playerNum={this.state.NumberOfPlayer}
        />
        {this.isGameOver() ? (
          <GameOver restartGame={this.restartGame} />
        ) : (
          <div className="grid-container">
            {this.state.shuffledCard.map((cardNumber, index) => (
              <Card
                key={index}
                id={index}
                cardNumber={cardNumber}
                isFlipped={this.state.isFlipped[index]}
                handleClick={this.handleClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default App;
