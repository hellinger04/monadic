package com.jhuoose.monadic.models.lesson.element;

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
