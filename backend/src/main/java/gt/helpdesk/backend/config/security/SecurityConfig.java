package gt.helpdesk.backend.config.security;

import gt.helpdesk.backend.entity.user.UserEntity;
import gt.helpdesk.backend.service.UserService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {


    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE + 1)
    public SecurityFilterChain filterChain(HttpSecurity http, @Autowired UserService userService) throws Exception {
        http.oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter(userService)))
                )
                .authorizeHttpRequests(
                        authorizeRequests -> authorizeRequests
                                .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
                                .requestMatchers(HttpMethod.GET, "/.well-known/*").permitAll()
                                .anyRequest().authenticated()
                );
        http.csrf(AbstractHttpConfigurer::disable);
        http.headers(headers -> headers
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
        );
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(List.of("https://*.overhare.com", "http://localhost:4200"));
            configuration.setAllowedMethods(List.of(
                    "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
            ));
            configuration.setAllowedHeaders(List.of(
                    "Authorization", "Content-Type", "Accept"
            ));
            configuration.setExposedHeaders(List.of(
                    "Authorization", "Content-Type", "Accept"
            ));
            configuration.setMaxAge(3600L);
            return configuration;
        }));
        return http.build();
    }

    @Bean
    public Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter(UserService userService) {
        return new Converter<Jwt, AbstractAuthenticationToken>() {
            @Override
            public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
                UserEntity user = userService.findByEmail(jwt.getClaimAsString("email"))
                        .orElseThrow(
                                () -> new RuntimeException("User not found with email: " + jwt.getClaimAsString("email"))
                        );

                return new UsernamePasswordAuthenticationToken(
                        user,
                        jwt.getTokenValue(),
                        user != null ? user.getAuthorities() : new ArrayList<>()
                );
            }
        };
    }

}
