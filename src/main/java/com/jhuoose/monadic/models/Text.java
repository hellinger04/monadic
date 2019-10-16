package com.jhuoose.monadic.models;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;


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
