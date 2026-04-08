package com.app.quantitymeasurement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Development Security Configuration
 *
 * ✅ Fixes "Failed to fetch"
 * ✅ Allows React (localhost:3000)
 * ✅ Disables CSRF for REST APIs
 * ✅ Permits all requests (dev only)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ✅ Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ✅ Disable CSRF (required for React POSTs)
            .csrf(csrf -> csrf.disable())

            // ✅ Stateless REST API
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ✅ Allow EVERYTHING (dev mode)
            .authorizeHttpRequests(auth ->
                auth.anyRequest().permitAll())

            // ✅ Allow H2 console
            .headers(headers ->
                headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ React dev server
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // ✅ Explicitly allow browser preflight
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        config.setAllowedHeaders(List.of("*"));

        // ❗ IMPORTANT: disable credentials for simplicity
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}