package com.jhuoose.monadic.models;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import java.nio.file.Files;
import java.nio.file.Path;

public class Text implements LessonElement {

    private int ID;
    private String filename;
    private String text = "";

    public Text(int ID, String filename) {
        this.ID = ID;
        this.filename = filename;
        try {
            File f = new File(filename);
            text = new Scanner(f).useDelimiter("\\Z").next();
        } catch (IOException e) {
            System.err.println("Bad filepath");
        }
        /*
        Scanner inFile;
//        try {
        inFile = new Scanner(filename);
//        } catch (FileNotFoundException e) {
//            throw new IllegalArgumentException("could not find specified file");
//        }

        while (inFile.hasNextLine()) {
            text = text + inFile.nextLine();
        }
         */
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
