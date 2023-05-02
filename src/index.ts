import express, { Router } from 'express'

import { myContainer } from './configs/inversify.config'
import { TYPES } from './configs/type'
import { Warrior } from './@types/interface'
import Provider from 'oidc-provider'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { Strategy as SamlStrategy } from 'passport-saml'

const ssoConfig = {
  issuer: 'http://localhost:3009',
  cert: 'certificate',
  entryPoint: 'http://localhost:3009/login2',
  logoutUrl: 'http://localhost:3009/logout2',
  identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
}

// Thiết lập passport
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  if (user) {
    done(null, user)
  }
})

// Đăng ký strategy SAML cho passport
passport.use(
  new SamlStrategy(
    {
      issuer: ssoConfig.issuer,
      path: '/login/callback',
      entryPoint: ssoConfig.entryPoint,
      logoutUrl: ssoConfig.logoutUrl,
      cert: ssoConfig.cert,
      identifierFormat: ssoConfig.identifierFormat,
    },
    (profile, done: any) => {
      // Xác thực thành công
      return done(null, profile)
    },
  ),
)

// const provider = new Provider('http://localhost:3009', {
//   clients: [
//     {
//       client_id: 'foo',
//       redirect_uris: ['http://localhost:3009/cb'],
//       response_types: ['code'],
//       grant_types: ['authorization_code'],
//       token_endpoint_auth_method: 'none',
//     },
//   ],
//   cookies: {
//     keys: ['token'],
//   },
//   findAccount(ctx, id) {
//     console.log('aaaaa')
//     return {
//       accountId: id,
//       async claims(use, scope) {
//         return { sub: id }
//       },
//     }
//   },
// })

// provider.initialize({
//   clients: { foo: { client_secret: null } },
//   keystore: {
//     keys: [
//       {
//         kty: 'RSA',
//         kid: 'mycert',
//         use: 'sig',
//         n: '...',
//         e: 'AQAB',
//         d: '...',
//         p: '...',
//         q: '...',
//         dp: '...',
//         dq: '...',
//         qi: '...',
//       },
//     ],
//   },
// }).then(() => {
//   provider.app.listen(3000, () => {
//     console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
//   });
// });

// provider.app.listen(3009, () => {
//   console.log('oidc-provider listening on port 3009, check http://localhost:3009/.well-known/openid-configuration')
// })

// const ninja = myContainer.get<Warrior>(TYPES.Warrior)

// expect(ninja.fight()).eql('cut!') // true
// expect(ninja.sneak()).eql('hit!') // true

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(passport.initialize());


// app.use('/oidc', provider.callback())

app.get('/cb', function (req, res) {
  res.json({
    success: true,
  })
  // res.send(ninja.sneak())
})


// Thiết lập middleware passport

// Đăng ký route cho việc đăng nhập
app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res) => {
  console.log('aaaa')
  res.redirect('/');
});

// Đăng ký route cho việc callback từ SSO server
app.post('/login/callback', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res) => {
  res.redirect('/');
});

// Đăng ký route cho việc đăng xuất
app.get('/logout', (req: any, res) => {
  req.logout();
  res.redirect(ssoConfig.logoutUrl);
});

// Route chính
app.get('/', (req: any, res) => {
  if (req.isAuthenticated()) {
    res.send(`Xin chào, ${req.user.nameID}!`);
  } else {
    res.redirect('/login');
  }
});
app.get('/login2' , (req, res) => {
  console.log('login2')
  res.json({success: true, login2: true})
})

app.get('/logout2' , (req, res) => {
  console.log('logout2')
  res.json({success: true, logout2: true})
})
// Khởi động server
app.listen(3009, () => {
  console.log('Server started on port 3000');
});



export {}
