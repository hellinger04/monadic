package com.jhuoose.monadic.models;

import com.jhuoose.monadic.models.User;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserTests {

    @Test
    void testUserConstructor() {
        String username = "Monadic-God";
        String password = "P@sSw0RD";
        User user = new User(username, password);
        assertEquals(username, user.getUsername());
        assertEquals(password, user.getPassword());
    }

    @Test
    void testSetUsername() {
        String username = "Monadic-God";
        String password = "P@sSw0RD";
        User user = new User(username, password);
        String newUsername = "Monadic-God-2.0";
        user.setUsername(newUsername);
        assertEquals(newUsername, user.getUsername());
    }

    @Test
    void testSetPassword() {
        String username = "Monadic-God";
        String password = "P@sSw0RD";
        User user = new User(username, password);
        String newPassword = "PA$$W0rd123";
        user.setPassword(newPassword);
        assertEquals(newPassword, user.getPassword());
    }

}
