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
            userExists = 409;
        }

        ctx.status(userExists);
    }

    public void login(Context ctx) throws SQLException, UserNotFoundException {
        try {
            var user = usersRepository.getOne(ctx.formParam("username", ""));
            BCrypt.Result result = BCrypt.verifyer().verify(ctx.formParam("password", "").toCharArray(),
                    user.getPassword().toCharArray());
            if (!result.verified) {
                ctx.status(401);
            } else {
                ctx.sessionAttribute("user", user);
                ctx.status(200);
            }
        } catch (UserNotFoundException e) {
            ctx.status(401);
        }
    }

    public User currentUser(Context ctx) {
        var user = (User) ctx.sessionAttribute("user");
        if (user == null) throw new ForbiddenResponse();
        return user;
    }

    public void changePassword(Context ctx) throws SQLException, UserNotFoundException {
        try {
            var user = usersRepository.getOne(ctx.formParam("username", ""));
            // first make sure the user has valid authentication
            BCrypt.Result result = BCrypt.verifyer().verify(ctx.formParam("password", "").toCharArray(),
                    user.getPassword().toCharArray());
            if (!result.verified) {
                ctx.status(401);
            } else {
                ctx.sessionAttribute("user", user);
                user.setPassword(BCrypt.withDefaults().hashToString(12, ctx.formParam("password", "").toCharArray()));
                ctx.status(200);
            }
        } catch (UserNotFoundException e) {
            ctx.status(401);
        }
    }
}
