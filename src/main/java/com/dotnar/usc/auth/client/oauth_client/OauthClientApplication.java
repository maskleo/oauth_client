package com.dotnar.usc.auth.client.oauth_client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@SpringBootApplication
@EnableOAuth2Sso
@RestController
public class OauthClientApplication  extends WebSecurityConfigurerAdapter {
    @RequestMapping("/user")
    public Principal user(Principal principal) {
        return principal;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http.antMatcher("/**").authorizeRequests().antMatchers("/",/*"/**",*/"/resources/**"
                , "/login**"
                , "/webjars/**"
                , "/js/**"
                , "/lib/**"
                , "/img/**"
                , "/style/**"
                , "/server/**"
                ).permitAll()
                .anyRequest().authenticated()
                .and().formLogin().loginPage("/login").permitAll()
                .and().logout().logoutSuccessUrl("/").permitAll()
                .and().csrf().disable()
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        ;
//        http.antMatcher("/**").authorizeRequests().antMatchers("/**").permitAll();
        // @formatter:on
    }

    public static void main(String[] args) {
        SpringApplication.run(OauthClientApplication.class, args);
    }
}