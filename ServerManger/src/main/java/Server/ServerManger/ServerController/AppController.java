package Server.ServerManger.ServerController;


import Server.ServerManger.Model.ResponceMsg;
import Server.ServerManger.Model.Server;
import Server.ServerManger.ServerService.Imptemente.implemente;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;


import static Server.ServerManger.enumeration.Status.SERVER_UP;
import static java.time.LocalDateTime.now;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

/**
 * @author Get Arrays (https://www.getarrays.io/)
 * @version 1.0
 * @since 9/4/2021
 */

@RestController
@RequestMapping("/server")
@RequiredArgsConstructor
public class AppController {
    private final implemente serverService;

    @GetMapping("/list")
    public ResponseEntity<ResponceMsg> getServers() throws InterruptedException {
        TimeUnit.SECONDS.sleep(2);
        return ResponseEntity.ok(
                ResponceMsg.builder()
                        .timeStamp(now())
                        .data(of("servers", serverService.list(30)))
                        .message("Servers retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @GetMapping("/ping/{ipAddress}")
    public ResponseEntity<ResponceMsg> pingServer(@PathVariable("ipAddress") String ipAddress) throws IOException {
        Server server = serverService.ping(ipAddress);
        return ResponseEntity.ok(
                ResponceMsg.builder()
                        .timeStamp(now())
                        .data(of("server", server))
                        .message(server.getStatus() == SERVER_UP ? "Ping success" : "Ping failed")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @PostMapping("/save")
    public ResponseEntity<ResponceMsg> saveServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(
                ResponceMsg.builder()
                        .timeStamp(now())
                        .data(of("server", serverService.create(server)))
                        .message("Server created")
                        .status(CREATED)
                        .statusCode(CREATED.value())
                        .build()
        );
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ResponceMsg> getServer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                ResponceMsg.builder()
                        .timeStamp(now())
                        .data(of("server", serverService.get(id)))
                        .message("Server retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponceMsg> deleteServer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                ResponceMsg.builder()
                        .timeStamp(now())
                        .data(of("deleted", serverService.delete(id)))
                        .message("Server deleted")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @GetMapping(path = "/image/{fileName}", produces = IMAGE_PNG_VALUE)
    public byte[] getServerImage(@PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home") + "/Desktop/stage/images/" + fileName));
    }
}
