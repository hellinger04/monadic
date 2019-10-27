package com.jhuoose.monadic.models;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class Lesson {

    private static final String problemRegex = "\\*\\*Problem \\d\\.\\d\\.\\d\\.:\\*\\*";

    int ID;
    ArrayList<LessonElement> lessonElements = new ArrayList<>();
    String description;

    public Lesson(int courseID, int lessonID) {
        this.ID = lessonID;

        String filePath = "src/main/resources/lessons/course_" + courseID + "/" + lessonID + ".md";
        String text = "";
        try {
            text = this.readFile(filePath);
        } catch (IOException e) {
            System.err.println("Bad filepath: " + filePath);
        }

        String[] elements = text.split("''''"); // FIXME Placeholder for the placeholder
        for (int i = 0; i < elements.length; ++i) {
            String elementText = elements[i];
            if (elementText.startsWith("problem\n")) {
                this.lessonElements.add(new Problem(i, elementText.substring(8)));
            } else {
                this.lessonElements.add(new Text(i, elementText));
            }
        }
    }

    private String readFile(String filePath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(new File(filePath)));
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
            sb.append("\n");
        }
        return sb.toString();
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public ArrayList<LessonElement> getLessonElements() {
        return lessonElements;
    }

    public void addLessonElement(LessonElement lessonElement) { this.lessonElements.add(lessonElement); }

}