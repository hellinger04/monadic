package com.jhuoose.monadic.models;


import java.util.HashMap;

/* Class to represent a User for the Monadic service
 */
public class User {

    private String username;
    private String password;
    private Enrollment enrollment;
    private HashMap<String, Integer> lessonsCompleted;
    private HashMap<String, String> solutions;

    public User(String username, String password, HashMap<String, Integer> lessonsCompleted, HashMap<String, String> solutions) {
        this.username = username;
        this.password = password;
        this.lessonsCompleted = lessonsCompleted;
        this.solutions = solutions;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public Enrollment getEnrollment() {
        return enrollment;
    }

    public HashMap<String, Integer> getLessonsCompleted() {
        return lessonsCompleted;
    }

    public HashMap<String, String> getSolutions() {
        return solutions;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEnrollment(Enrollment enrollment) {
        this.enrollment = enrollment;
    }

    public void setLessonsCompleted(HashMap<String, Integer> lessonsCompleted) {
        this.lessonsCompleted = lessonsCompleted;
    }

    public void setSolutions(HashMap<String, String> solutions) {
        this.solutions = solutions;
    }


}
