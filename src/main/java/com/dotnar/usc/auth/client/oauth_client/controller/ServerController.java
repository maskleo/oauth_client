package com.dotnar.usc.auth.client.oauth_client.controller;

import org.apache.oltu.oauth2.client.OAuthClient;
import org.apache.oltu.oauth2.client.URLConnectionClient;
import org.apache.oltu.oauth2.client.request.OAuthBearerClientRequest;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.client.response.OAuthAccessTokenResponse;
import org.apache.oltu.oauth2.client.response.OAuthResourceResponse;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.UUID;

@Controller
@RequestMapping("/server")
public class ServerController {

    private static final Logger logger = LoggerFactory.getLogger(ServerController.class);

    @Value("${security.oauth2.client.userAuthorizationUri}")
    private String userAuthorizationUri;

    @Value("${security.oauth2.client.accessTokenUri}")
    private String accessTokenUri;

    @Value("${security.oauth2.client.clientId}")
    private String clientId;

    @Value("${security.oauth2.client.clientSecret}")
    private String clientSecret;

    @Value("${security.oauth2.resource.userInfoUri}")
    private String userInfoUri;

    @Value("${security.oauth2.client.redirectURI}")
    private String redirectURI;

    @Value("${security.oauth2.client.scope}")
    private String scope;

    //提交申请code的请求
    @RequestMapping(value = "/requestServerCode", method = RequestMethod.GET)
    public String requestServerFirst() throws OAuthProblemException {
        String requestUrl = null;
        final UUID uuid = UUID.randomUUID();
        String state = uuid.toString();
        try {
            //构建oauthd的请求。设置请求服务地址（accessTokenUrl）、clientId、response_type、redirectUrl
            OAuthClientRequest accessTokenRequest = OAuthClientRequest
                    //.authorizationLocation("http://testauth.makeys.info/auth/oauth/authorize")
                    .authorizationLocation(userAuthorizationUri)
                    .setResponseType("code")
                    .setClientId(clientId)
                    .setRedirectURI(redirectURI)
                    .setScope(scope)
                    .setState(state)
                    .buildQueryMessage();
            requestUrl = accessTokenRequest.getLocationUri();
            logger.error(requestUrl);
        } catch (OAuthSystemException e) {
            e.printStackTrace();
        }
        return "redirect:" + requestUrl;
    }

    //接受客户端返回的code，提交申请access token的请求
    @RequestMapping("/callbackCode")
    public Object toLogin(HttpServletRequest httpRequest) throws OAuthProblemException {
        String code = httpRequest.getParameter("code");
        OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());
        try {
            OAuthClientRequest accessTokenRequest = OAuthClientRequest
                    //.tokenLocation("http://testauth.makeys.info/auth/oauth/token")
                    .tokenLocation(accessTokenUri)
                    .setGrantType(GrantType.AUTHORIZATION_CODE)
                    .setClientId(clientId)
                    .setClientSecret(clientSecret)
                    .setCode(code)
                    .setRedirectURI(redirectURI)
                    .setScope(scope)
                    .buildQueryMessage();
            //去服务端请求access token，并返回响应
            OAuthAccessTokenResponse oAuthResponse = oAuthClient.accessToken(accessTokenRequest, OAuth.HttpMethod.POST);
            //获取服务端返回过来的access token
            String accessToken = oAuthResponse.getAccessToken();
            //查看access token是否过期
            //Long expiresIn = oAuthResponse.getExpiresIn();
            //System.out.println("客户端/callbackCode方法的token：：：" + accessToken);
            return "redirect:http://localhost:1116/server/accessToken?accessToken=" + accessToken;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    //接受服务端传回来的access token，由此token去请求服务端的资源（用户信息等）
    @RequestMapping("/accessToken")
    @ResponseBody
    public String accessToken(String accessToken) {
        OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());
        try {
            OAuthClientRequest userInfoRequest = new OAuthBearerClientRequest(userInfoUri)
                    .setAccessToken(accessToken).buildQueryMessage();
            OAuthResourceResponse resourceResponse = oAuthClient.resource(userInfoRequest, OAuth.HttpMethod.GET, OAuthResourceResponse.class);
            String username = resourceResponse.getBody();
            return username;
        } catch (OAuthSystemException e) {
            e.printStackTrace();
        } catch (OAuthProblemException e) {
            e.printStackTrace();
        }
        return null;
    }

}
