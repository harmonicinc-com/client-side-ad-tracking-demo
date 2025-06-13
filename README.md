# Harmonic Client Side Ad Tracking Demo Webapp

This project is a sample player webapp for demonstration of Client Side Ad Tracking with Harmonic's Personalized Media Manipulation solution.

Demo page: [https://harmonicinc-com.github.io/client-side-ad-tracking-demo/](https://harmonicinc-com.github.io/client-side-ad-tracking-demo/)

## Instructions for local run

In the project directory:

1. `npm install`

2. `npm start`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. Enter a media URL for Personalized Media Manipulation output and press the "LOAD" button.

5. Observe listed ad pods, ads, and tracking events in the page.

## Appendix

### How the Playback URL and Beaconing URL are Obtained by the Player

1. The player sends a POST request to the manifest endpoint. For e.g., a POST request is sent to:
    ```
    https://my-host/variant/v1/dash/manifest.mpd
    ```

2. PMM responds with the URLs. For e.g.,
    ```
    {
        "manifestUrl": "./manifest.mpd?sessid=a700d638-a4e8-49cd-b288-6809bd35a3ed",
        "trackingUrl": "./metadata?sessid=a700d638-a4e8-49cd-b288-6809bd35a3ed"
    }
    ```

3. The player constructs the URLs by combining the host in the original URL and the relative URLs obtained. For e.g.,
    ```
    Manifest URL: https://my-host/variant/v1/dash/manifest.mpd?sessid=a700d638-a4e8-49cd-b288-6809bd35a3ed

    Metadata URL: https://my-host/variant/v1/dash/metadata?sessid=a700d638-a4e8-49cd-b288-6809bd35a3ed
    ```