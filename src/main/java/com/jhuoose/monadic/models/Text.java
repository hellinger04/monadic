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
    private String text;

    public Text(int ID, String filename) throws FileNotFoundException {
        this.ID = ID;
        this.filename = filename;
        List<String> lines = new ArrayList<>();
        try {
            lines = Files.readAllLines(Path.of(filename));
        } catch (IOException e) {
            System.err.println("Bad filepath");
        }
        for (String line : lines) {
            text += line;
        }
        System.out.println(text);
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
