package com.jhuoose.monadic.models;


import com.jhuoose.monadic.models.lesson.Lesson;
import com.jhuoose.monadic.models.lesson.element.LessonElement;
import com.jhuoose.monadic.models.lesson.element.Problem;

import java.util.HashMap;
import java.util.Map;

/* Class to represent a User for the Monadic service
 */
public class User {

    private String username;
    private String password;
    private Enrollment enrollment;
    private HashMap<String, String> solutions;
    private HashMap<String, Integer> problemsCompleted;

    public User(String username, String password, HashMap<String, Integer> problemsCompleted, HashMap<String, String> solutions) {
        this.username = username;
        this.password = password;
        this.problemsCompleted = problemsCompleted;
        this.solutions = solutions;
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.problemsCompleted = new HashMap<>();
        this.solutions = new HashMap<>();
        for (int i = 0; i < 5; ++i) {
            putProblemElems(problemsCompleted, solutions, new Lesson(0, i));
        }
        for (int i = 0; i < 8; ++i) {
            putProblemElems(problemsCompleted, solutions, new Lesson(1, i));
        }
        for (int i = 0; i < 5; ++i) {
            putProblemElems(problemsCompleted, solutions, new Lesson(2, i));
        }
        for (int i = 0; i < 3; ++i) {
            putProblemElems(problemsCompleted, solutions, new Lesson(3, i));
        }
    }

    private void putProblemElems(HashMap<String, Integer> problemsCompleted, HashMap<String, String> solutions, Lesson lesson) {
        for (LessonElement le: lesson.getLessonElements()) {
            if (le.isProblem()) {
                Problem problemLE = (Problem) le;
                String problemKey = "c" + lesson.getCourseID() + "_l" + lesson.getID() + "_p" + problemLE.getID();
                problemsCompleted.put(problemKey, 0);
                solutions.put(problemKey, problemLE.getStarterCode());
            }
        }
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

    public HashMap<String, String> getSolutions() {
        return solutions;
    }

    public HashMap<String, Integer> getProblemsCompleted() {
        return problemsCompleted;
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

    public void setSolutions(HashMap<String, String> solutions) {
        this.solutions = solutions;
    }

    public void setProblemsCompleted(HashMap<String, Integer> problemsCompleted) {
        this.problemsCompleted = problemsCompleted;
    }

    private int getLessonStatus(Lesson lesson) {
        for (LessonElement le: lesson.getLessonElements()) {
            if (le.isProblem()) {
                Problem problemLE = (Problem) le;
                String problemKey = "c" + lesson.getCourseID() + "_l" + lesson.getID() + "_p" + problemLE.getID();
                int problemStatus = problemsCompleted.get(problemKey);
                if (problemStatus != 2) return 0;
            }
        }
        return 2;
    }

    public HashMap<String, Integer> getUserStatus() {
        HashMap<String, Integer> lessonStatus = new HashMap<>();
        for (int i = 0; i < 5; ++i) {
            lessonStatus.put("c0_l" + i, getLessonStatus(new Lesson(0, i)));
        }
        for (int i = 0; i < 8; ++i) {
            lessonStatus.put("c1_l" + i, getLessonStatus(new Lesson(1, i)));
        }
        for (int i = 0; i < 5; ++i) {
            lessonStatus.put("c2_l" + i, getLessonStatus(new Lesson(2, i)));
        }
        for (int i = 0; i < 3; ++i) {
            lessonStatus.put("c3_l" + i, getLessonStatus(new Lesson(3, i)));
        }

        return lessonStatus;
    }


}
