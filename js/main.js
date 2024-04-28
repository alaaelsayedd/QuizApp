let categorey = document.getElementById("categorySelect");
let diffulity = document.getElementById("levelSelect");
let questionNumber = document.getElementById("questionNumber");
let rowContainer = document.querySelector(".row1");
let rowQuesContainer = document.querySelector(".row2");
console.log(rowContainer);
let questions, quiz;
document.querySelector(".start-btn").addEventListener("click", async () => {
  let value = [categorey.value, diffulity.value, questionNumber.value];
  quiz = new Qiuz(...value);
  questions = await quiz.fetchApi();
  rowContainer.classList.add("d-none");
  console.log(questions);
  let question = new Question(0);
  question.displayQuestion();
});
class Qiuz {
  constructor(categoreyValue, diffulityValue, questionNumberValue) {
    this.categorey = categoreyValue;
    (this.diffulity = diffulityValue), (this.qnumber = questionNumberValue);
    this.score = 0;
  }
  getQuiz() {
    return `https://opentdb.com/api.php?amount=${this.qnumber}&category=${this.categorey}&difficulty=${this.diffulity}`;
  }
  async fetchApi() {
    let data = await fetch(this.getQuiz());
    let response = await data.json();
    return response.results;
  }
}
class Question {
  constructor(index) {
    this.index = index;
    this.ques = questions[this.index].question;
    this.correctAnswer = questions[index].correct_answer;
    this.incorrectAnswers = questions[index].incorrect_answers;
    this.type = questions[index].category;
    this.allAnswrers = this.getAllAnswers();
    this.isAnswerd = false;
  }
  getAllAnswers() {
    let allAnswrers = [...this.incorrectAnswers, this.correctAnswer];
    return allAnswrers.sort();
  }
  displayQuestion() {
    let questionConatiner = `
        <div class="col-12 ">
        <div class="d-flex justify-content-between py-3 px-2">
        <div >${this.type}</div>
        <div> ${this.index + 1} of ${questions.length} Questions </div>
      </div>
      </div>
      <div class="col-12 mt-3">
        <h3 class="fs-3 px-5 text-center">
         ${this.ques}
        </h3>
      </div>
      <div class="col-12">
        <div>
          <ul class="list-unstyled d-flex flex-wrap text-center mx-auto ">
            ${this.allAnswrers.map((answer) => {
              return `<li>${answer}</li>`;
            })}
          </ul>
        </div>
      </div>
      <div class="col-12">
        <div>
          <h5 class="fs-3 fw-bold text-center main-color py-2">
             Score : ${quiz.score}
          </h5>
        </div>
      </div>
         `;

    rowQuesContainer.innerHTML = questionConatiner;
    this.getNextQues();
  }
  getNextQues()
  {
    let lists = document.querySelectorAll("li");
    lists.forEach((li)=>{
      li.addEventListener("click",()=>{
        this.checkAnswer(li);
        setTimeout(()=>{
            this.nextQuestion();
        },1500)
       
      })
    })
  }
  nextQuestion() {
    this.index++;
        if (this.index < questions.length) {
            let nextQues = new Question(this.index);
            nextQues.displayQuestion();
          }
         else {
          let endOfGame = `<div class="col-12 text-center">
                <p class="p-2 fs-3 fw-bold main-color">your score is ${quiz.score} of ${questions.length}</p>
            </div>
            <div class="col-12 text-center pb-2 ">
              <button class="btn btn-primary p-2 text-center try-btn">try Agin </button>
            </div>`;
           rowQuesContainer.innerHTML = endOfGame;
            document.querySelector(".try-btn").addEventListener("click", () => {
            window.location.reload();
          });
        }
     
    }
  
  checkAnswer(answer) {
    if (this.isAnswerd == false) {
      this.isAnswerd = true;

      if (answer.innerText == this.correctAnswer) {
        answer.classList.add("correct");
        console.log(answer.innerText);
        quiz.score++;
      } else {
        answer.classList.add("wrong");
        
      }
    }
  }
}
