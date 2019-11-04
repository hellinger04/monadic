package com.jhuoose.monadic.models.lesson.answer;

public class StudentAnswer extends Answer {

    public StudentAnswer(int ID, String answer) {
        super(ID, answer);
    }

    public void setAnswer(String answer) {
        super.answer = answer;
    }

}
