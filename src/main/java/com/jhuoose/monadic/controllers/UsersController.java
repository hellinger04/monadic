package com.jhuoose.monadic.controllers;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.jhuoose.monadic.models.User;
import com.jhuoose.monadic.repositories.UserNotFoundException;
import com.jhuoose.monadic.repositories.UsersRepository;
import io.javalin.http.Context;
import io.javalin.http.ForbiddenResponse;

import java.sql.SQLException;

public class UsersController {
    private UsersRepository usersRepository;

    public UsersController(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public void signup(Context ctx) throws SQLException {
        var userExists = 201;

        try {
            usersRepository.create(new User(ctx.formParam("username", ""),
                    BCrypt.withDefaults().hashToString(12, ctx.formParam("password", "").toCharArray()))
            );
        } catch (SQLException e) {
            userExists = 401;
        }

        ctx.status(userExists);
    }

    public void login(Context ctx) throws SQLException, UserNotFoundException {
        var user = usersRepository.getOne(ctx.formParam("username", ""));
        BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(),
                BCrypt.withDefaults().hashToString(12, ctx.formParam("password", "").toCharArray()));
        if (!result.verified) {
            ctx.status(401);
        } else {
            ctx.sessionAttribute("user", user);
            ctx.status(200);
        }
    }

    public User currentUser(Context ctx) {
        var user = (User) ctx.sessionAttribute("user");
        if (user == null) throw new ForbiddenResponse();
        return user;
    }
}