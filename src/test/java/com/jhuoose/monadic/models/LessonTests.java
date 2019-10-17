package com.jhuoose.monadic.models;

import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class LessonTests {
    @Test
    void testGettersAndSetters() throws FileNotFoundException {
        LessonElement text = new Text(1, "test text");
        assertEquals(1, text.getID());
        assertEquals("test text", text.getContents());
        assertTrue(!text.isProblem());
    }
}

