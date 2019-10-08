package com.jhuoose.monadic.models;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Text implements LessonElement {

    private int ID;
    private String filename;
    private String text;

    public Text(int ID, String filename) throws FileNotFoundException {
        this.ID = ID;
        this.filename = filename;
        Scanner inFile;
//        try {
        inFile = new Scanner(filename);
//        } catch (FileNotFoundException e) {
//            throw new IllegalArgumentException("could not find specified file");
//        }
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
