package com.jhuoose.monadic.models;


/* Class to represent a User for the Monadic service
 */
public class User {

    private String username;
    private String password;
    private Enrollment enrollment;
    private Avatar avatar;
    private Wallet wallet;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
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

    public Avatar getAvatar() {
        return avatar;
    }


    public Wallet getWallet() {
        return token;
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

    public void setAvatar(Avatar avatar) {
        this.avatar = avatar;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }
}
