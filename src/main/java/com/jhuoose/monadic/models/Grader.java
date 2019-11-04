package com.jhuoose.monadic.models;

import com.jhuoose.monadic.models.lesson.answer.StudentAnswer;
import com.jhuoose.monadic.models.lesson.element.Problem;

public class Grader {

    public Grader() {
    }

    public String grade(Problem problem, StudentAnswer answer) {
        // TODO return not only how the student got the problem wrong, but how they could improve in the future, how
        //  they got the problem wrong. we can interpret compilation errors & give detailed feedback based on the errors
        return "test";
    }
}


