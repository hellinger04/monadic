package com.jhuoose.monadic.models;

public class TestCase {

    // private String input;
    private String output;

    private String test;

    public TestCase(String test, String output) {
        // this.input = input;
        this.output = output;
        this.test = test;
    }

    /* public String getInput() {
        return input;
    }
     */

    public String getOutput() {
        return output;
    }
}
