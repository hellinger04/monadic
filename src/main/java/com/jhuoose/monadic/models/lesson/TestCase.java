package com.jhuoose.monadic.models.lesson;

public class TestCase {

    private int ID;
    private String input;
    private String output;

    public TestCase(int ID, String input, String output) {
        this.ID = ID;
        this.input = input;
        this.output = output;
    }

    public int getID() { return ID; }

    public String getInput() {
        return input;
    }

    public String getOutput() {
        return output;
    }
}
