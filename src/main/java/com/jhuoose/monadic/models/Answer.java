package com.jhuoose.monadic.models;

public class Answer {

    protected int ID;
    protected String answer;

    public Answer(int ID, String answer) {
        this.ID = ID;
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }

}
