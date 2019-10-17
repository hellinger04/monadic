package com.jhuoose.monadic.models;

import java.io.File;
import java.io.IOException;
import java.io.FileReader;
import java.io.BufferedReader;
import java.util.Iterator;
import java.util.Scanner;


public class Text implements LessonElement {

    private int ID;
    private String filename;
    private String text = "";

    public Text(int ID, String filename) {
        this.ID = ID;
        this.filename = filename;
        try {
            BufferedReader reader = new BufferedReader(new FileReader(
            new File(filename)));
            String line;

            while ((line = reader.readLine()) != null) {
                this.text = this.text + line + "\n";
            }
        } catch (IOException e) {
            System.err.println("Bad filepath");
        }
    }
/* Do not delete, might be used in the future.
   This is a constructor for providing literal lesson text
    public Text(int ID, String text) {
        this.ID = ID;
        this.text = text;
    }
 */

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
