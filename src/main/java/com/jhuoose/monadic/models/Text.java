package com.jhuoose.monadic.models;

import java.io.File;
import java.io.IOException;
import java.io.FileReader;
import java.io.BufferedReader;
import java.util.Iterator;
import java.util.Scanner;


public class Text implements LessonElement {

    private int ID;
    private String text;

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
