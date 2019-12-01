package com.jhuoose.monadic.repositories;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.User;
import com.jhuoose.monadic.models.lesson.Lesson;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;


public class UsersRepository {
    private Connection connection;

    public UsersRepository(Connection connection) throws SQLException {
        this.connection = connection;
        var statement = connection.createStatement();
        statement.execute("DROP TABLE IF EXISTS  users");
        statement.execute("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, lessonsCompleted TEXT)");
        statement.close();
    }

    public boolean userExists(String username) throws SQLException, UserNotFoundException {
        var statement = connection.prepareStatement( "SELECT username FROM users WHERE username = ?");
        statement.setString( 1, username);
        var result = statement.executeQuery();
        try {
            if (result.next()) {
                return true;
            } else {
                return false;
            }
        }
        finally {
            statement.close();
            result.close();
        }
    }

    public User getOne(String username) throws SQLException, UserNotFoundException {
        ObjectMapper objectMapper = new ObjectMapper();
        var statement = connection.prepareStatement("SELECT username, password, lessonsCompleted FROM users WHERE username = ?");
        statement.setString(1, username);
        var result = statement.executeQuery();
        try {
            if (result.next()) {
                HashMap<String, Integer> lessonsCompleted = objectMapper.readValue(result.getString("lessonsCompleted"), HashMap.class);
                return new User(
                        result.getString("username"),
                        result.getString("password"),
                        lessonsCompleted
                );
            } else {
                throw new UserNotFoundException();
            }
        /* Automatically generated exception by Jackson */
        } catch (IOException e) {
            e.printStackTrace();
            throw new UserNotFoundException();
        } finally {
            statement.close();
            result.close();
        }
    }

    public void create(User user) throws SQLException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        var statement = connection.prepareStatement("INSERT INTO users (username, password, lessonsCompleted) VALUES (?, ?, ?)");
        statement.setString(1, user.getUsername());
        statement.setString(2, user.getPassword());
        statement.setString(3, objectMapper.writeValueAsString(user.getLessonsCompleted()));
        statement.execute();
        statement.close();
    }

    public void modifyLessonStatus(User user, String lessonID, int setting) throws SQLException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        HashMap<String, Integer> lessonsCompleted = user.getLessonsCompleted();
        lessonsCompleted.replace(lessonID, setting);
        user.setLessonsCompleted(lessonsCompleted);
        var statement = connection.prepareStatement("UPDATE users SET lessonsCompleted = ? WHERE username = ?");
        statement.setString(1, objectMapper.writeValueAsString(user.getLessonsCompleted()));
        statement.setString(2, user.getUsername());
        statement.execute();
        statement.close();
    }
}
