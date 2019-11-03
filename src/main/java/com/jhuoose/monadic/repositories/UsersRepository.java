package com.jhuoose.monadic.repositories;

import com.jhuoose.monadic.models.User;

import java.sql.Connection;
import java.sql.SQLException;

public class UsersRepository {
    private Connection connection;

    public UsersRepository(Connection connection) throws SQLException {
        this.connection = connection;
        var statement = connection.createStatement();
        statement.execute("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT)");
        statement.close();
    }

    public User getOne(String username) throws SQLException, UserNotFoundException {
        var statement = connection.prepareStatement("SELECT username, password FROM users WHERE username = ?");
        statement.setString(1, username);
        var result = statement.executeQuery();
        try {
            if (result.next()) {
                return new User(
                        result.getString("username"),
                        result.getString("password")
                );
            } else {
                throw new UserNotFoundException();
            }
        }
        finally {
            statement.close();
            result.close();
        }
    }

    public void create(User user) throws SQLException {
        var statement = connection.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
        statement.setString(1, user.getUsername());
        statement.setString(2, user.getPassword());
        statement.execute();
        statement.close();
    }
}