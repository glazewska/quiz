$(document).ready(function() {

    let questions;
    let quiz = $('#quiz');
    let counter = 0;
    const startQuiz = $("#start-quiz");
    const nextButton = $("#next");
    const prevButton = $("#prev");
    const finishButton = $("#finish");
    let startButton = $("#start");
    let yourChoices = [];

    $.ajax({
        url: "http://localhost:3000/questions",
        type: "GET"
    }).done(function(response) {
        questions = response;
    });

    firstView();

    nextButton.on("click", function(event) {
        event.preventDefault();
        answer();
        if (isNaN(yourChoices[counter])) {
            alert("Don't be afraid. Pick one :)");
        } else {
            counter++;
            showNextQuestion();
        }
    });

    prevButton.on("click", function(event) {
        event.preventDefault();
        answer();
        counter--;
        showNextQuestion();
    });

    startButton.on("click", function(event) {
        event.preventDefault();
        let finalScore = $("h3");
        yourChoices = [];
        counter = 0;
        showNextQuestion();
        finalScore.remove();
        startButton.hide();
    });

    finishButton.on("click", function(event) {
        event.preventDefault();
        let finalScore = showFinalScore();
        quiz.append(finalScore).show();
        nextButton.hide();
        prevButton.hide();
        startButton.show();
    });

    startQuiz.on("click", function(event) {
        event.preventDefault();
        showNextQuestion();
    })

    function firstView() {
        startQuiz.show();
        nextButton.hide();
        finishButton.hide();
    }

    function createNextQuestion(index) {
        let questionBox = $("<div>", {
            id: "question-box"
        });

        let questionNumber = $("<h3>Question " + (index + 1) + "/" + questions.length + "</h3>");
        let question = $("<p>").append(questions[index].question);
        let answerBullet = showChoices(index);
        questionBox.append(questionNumber);
        questionBox.append(question);
        questionBox.append(answerBullet);

        return questionBox;
    }

    function showChoices(index) {
        let choicesList = $("<div>", {
            class: "qList"
        });
        let choice;
        let input;
        for (let i = 0; i < questions[index].choices.length; i++) {
            choice = $('<label></label>')
            input = '<input type="radio" name="bullet" value=' + i + ' />';
            input += questions[index].choices[i];
            choice.append(input);
            choicesList.append(choice);
        }
        return choicesList;
    }

    function showNextQuestion() {
        quiz.hide(function() {
            $("#question-box").remove();

            if (counter < questions.length) {
                let nextQuestion = createNextQuestion(counter);
                quiz.append(nextQuestion).show();
                $('#question-box p').addClass("animate");
                if (!(isNaN(yourChoices[counter]))) {
                    $("input[value=' + yourChoices[counter] + ']").prop("checked", true);
                } else if (counter === 1) {
                    prevButton.show();
                } else if (counter === 0) {
                    finishButton.hide();
                    prevButton.hide();
                    nextButton.show();
                    startQuiz.hide();
                } else if (counter == (questions.length - 1)) {
                    nextButton.hide();
                    finishButton.show();
                }
            }
        });
    }

    function answer() {
        yourChoices[counter] = $("input[name=bullet]:checked").val();
    }

    function showFinalScore() {
        let finalScore = $("<h3>")
        let matchingPoints = 0;
        let finalPercentage;

        $("#question-box").remove();
        finishButton.hide();

        for (let i = 0; i < yourChoices.length; i++) {
            if (yourChoices[i] == questions[i].bestAnswer) {
                matchingPoints++;
            }
        }
        finalPercentage = (Math.floor((matchingPoints / questions.length) * 100));

        if (finalPercentage <= 50) {
            finalScore.append("We're matching " + finalPercentage + "%. Maybe we could still get along");
        } else if (finalPercentage > 60 || finalPercentage < 80) {
            finalScore.append("We're matching " + finalPercentage + "%. I would love to work with you");
        } else {
            finalScore.append("You're perfect!");
        }

        console.log(finalPercentage);
        return finalScore;
    }
});
