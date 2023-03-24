package nodeapp;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

/**
 * This sample is based on our official tutorials:
 * <ul>
 *   <li><a href="https://gatling.io/docs/gatling/tutorials/quickstart">Gatling quickstart tutorial</a>
 *   <li><a href="https://gatling.io/docs/gatling/tutorials/advanced">Gatling advanced tutorial</a>
 * </ul>
 */
public class NodeSimulation extends Simulation {


    ChainBuilder getHome =
        repeat(1).on(
            exec(
                http("GET /")
                    .get("/")
                    .check(status().is(200))
            )
        );

    // ChainBuilder postSignup =
    //     repeat(2).on(
    //         exec(
    //             http("Post /signup")
    //                 .post("/signup")
    //                 .header("content-type", "application/x-www-form-urlencoded")
    //                 .body(StringBody("username=foobar&password=okiedokie"))
    //                 .check(status().is(200))
    //         )
    //     );

    ChainBuilder getRandomBlocking = 
        repeat(2).on(
            exec(
                http("GET /eventloop/block/random")
                    .get("/eventloop/block/random")
                    .check(status().is(200))
            )
        );

    HttpProtocolBuilder httpProtocol =
        http.baseUrl(System.getenv("GATLING_TARGET_BASE_URL"))
            .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
            .acceptLanguageHeader("en-US,en;q=0.5")
            .acceptEncodingHeader("gzip, deflate")
            .userAgentHeader(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0"
            );

    ScenarioBuilder homePageUsers = scenario("Home").exec(getHome, getHome, getHome);
    ScenarioBuilder expensiveOpUsers = scenario("Expensive Operation Users").exec(getRandomBlocking);

    {
        setUp(
            homePageUsers.injectOpen(
                constantUsersPerSec(100).during(30)
            ),
            expensiveOpUsers.injectOpen(
                constantUsersPerSec(30).during(10),
                constantUsersPerSec(10).during(10),
                constantUsersPerSec(30).during(15)
            )
        ).protocols(httpProtocol);
    }
}
