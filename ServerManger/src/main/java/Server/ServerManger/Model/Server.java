package Server.ServerManger.Model;


import Server.ServerManger.enumeration.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

;

/**
 * @author Get Arrays (https://www.getarrays.io/)
 * @version 1.0
 * @since 9/4/2021
 */

@Entity
@Data
@NoArgsConstructor
//@AllArgsConstructor
public class Server {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(unique = true)
    @NotEmpty(message = "IP Address cannot be empty or null")
    private String ipAddress;
    private String name;
    private String memory;
    private String type;
    private String imageUrl;
    private Status status;



    public Server(String ipAddress,String name,String memory,String type,String imageUrl,Status status) {
        this.ipAddress = ipAddress;
        this.name=name;
        this.memory=memory;
        this.type=type;
        this.imageUrl=imageUrl;
        this.status=status;
    }
}
