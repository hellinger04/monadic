package com.jhuoose.monadic.models;

import java.util.Scanner;

public class Text implements LessonElement {

    private int ID;
    private String filename;
    private String text;

    public Text(int ID, String filename) {
        this.ID = ID;
        this.filename = filename;
        Scanner inFile = new Scanner(filename);
        while (inFile.hasNextLine()) {
            text = text + inFile.nextLine();
        }
    }

    public int getID() {
        return this.ID;
    }

    public boolean isProblem() {
        return false;
    }

    public String getContents() {
        return text;
    }


}
