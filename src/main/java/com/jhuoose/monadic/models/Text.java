package com.jhuoose.monadic.models;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Text implements LessonElement {

    private int ID;
    private String text;

    //constructor for providing file with lesson text
    public Text(int ID, Scanner inFile) {
        this.ID = ID;
        while (inFile.hasNextLine()) {
            text = text + inFile.nextLine();
        }
    }

    //constructor for providing literal lesson text
    public Text(int ID, String text) {
        this.ID = ID;
        this.text = text;
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
