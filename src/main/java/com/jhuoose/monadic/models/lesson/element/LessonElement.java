package com.jhuoose.monadic.models.lesson.element;

public interface LessonElement {

    /* return ID of current element
     */
    int getID();

    /* return whether the LessonElement is a Problem
     */
    boolean isProblem();

    /* return contents of LessonElement
     */
    String getContents();

}
