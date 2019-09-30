package com.jhuoose.monadic.models;

public class StudentAnswer extends Answer {

    public StudentAnswer(int ID, String answer) {
        super(ID, answer);
    }

    public void setAnswer(String answer) {
        super.answer = answer;
    }

}
