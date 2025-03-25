import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class PubsubController {
  @EventPattern('scraper.results.ok')
  handleScraperOK(@Payload() url: string) {
    console.log(url);
  }

  @EventPattern('scraper.results.invalid')
  handleScraperInvalid() {
    // This pattern indicates that the URL is not defined properly in the request body.
    console.error(
      'Scraper service responded with invalid pattern. Is the URL field set in the initial broker request?',
    );
  }

  @EventPattern('scraper.results.fail')
  handleScraperFail() {}

  @EventPattern('scraper.results.unknown')
  handleScraperUnknown() {
    //
  }

  @EventPattern('scraper.results.internal')
  handleScraperInternalError() {}

  @EventPattern('scraper.results.notfound')
  handleScraperNotFound() {}

  @EventPattern('scraper.results.unavailable')
  handleScraperUnavailable() {}

  @EventPattern('scraper.results')
  handleScraperResults() {
    console.error(
      "Base event pattern. If you're reading this then the scraper service has not been configured properly.",
    );
  }
}
