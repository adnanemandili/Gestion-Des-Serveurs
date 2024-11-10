package Server.ServerManger.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve images from /usr/share/images folder inside the container
        registry.addResourceHandler("/server/image/**")
                .addResourceLocations("file:/usr/share/images/");
    }
}

