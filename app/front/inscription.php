<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inscription — Châtillon Boxing Club (ACSC92)</title>
<link rel="icon" href="img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png">
<meta name="description" content="Inscription en ligne au Châtillon Boxing Club (ACSC92) via AssoConnect.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=Barlow+Semi+Condensed:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<style>
  body.insc{background:var(--bg);min-height:100vh}
  .insc-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;
    padding:.9rem clamp(1rem,4vw,2.5rem);background:var(--bg);border-bottom:1px solid var(--line)}
  .insc-top .brand{display:flex;align-items:center;gap:.7rem;font-family:var(--util);font-weight:700;letter-spacing:.04em;color:var(--text);text-decoration:none;text-transform:uppercase;font-size:.95rem}
  .insc-top .brand img{width:34px;height:34px;border-radius:50%}
  .insc-back{font-family:var(--util);text-transform:uppercase;letter-spacing:.05em;font-size:.8rem;font-weight:700;color:var(--text);
    text-decoration:none;border:1px solid var(--line);padding:.5rem .9rem;border-radius:6px;transition:.2s}
  .insc-back:hover{border-color:var(--red);color:var(--red-bright)}
  .insc-wrap{max-width:900px;margin:0 auto;padding:clamp(2rem,6vw,3.5rem) clamp(1rem,4vw,2rem) 4rem}
  .insc-wrap .eyebrow{font-family:var(--util);text-transform:uppercase;letter-spacing:.18em;font-size:.8rem;font-weight:700;color:var(--red-bright);display:flex;align-items:center;gap:.6rem}
  .insc-wrap .eyebrow::before{content:"";width:34px;height:2px;background:var(--red)}
  .insc-wrap h1{font-family:"Anton",sans-serif;font-size:clamp(2.4rem,8vw,4rem);line-height:.95;margin:.5rem 0 .6rem;text-transform:uppercase;color:var(--text)}
  .insc-wrap .lead{color:var(--muted);max-width:60ch;line-height:1.55;margin-bottom:.4rem}
  .insc-form{margin-top:2rem;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:clamp(1rem,3vw,1.6rem);min-height:420px}
  .iframe-asc-container{width:100%}
  .iframe-asc-container iframe{width:100%!important;min-height:900px;border:0}
  .insc-fallback{color:var(--muted);text-align:center;padding:2rem 1rem;line-height:1.6}
  .insc-fallback a{color:var(--red-bright);font-weight:600}
  .insc-help{margin-top:1.4rem;font-size:.9rem;color:var(--muted);line-height:1.55}
  .insc-help a{color:var(--text)}
</style>
</head>
<body class="insc">

<div class="insc-top">
  <a href="index.html" class="brand"><img src="img/logo-acsc92.png" alt="ACSC92">Châtillon Boxing Club</a>
  <a href="index.html" class="insc-back">← Retour au site</a>
</div>

<main class="insc-wrap">
  <div class="eyebrow">Rejoins le club</div>
  <h1>Inscription en ligne</h1>
  <p class="lead">Adhésion et paiement sécurisés via notre plateforme AssoConnect. Remplis le formulaire ci-dessous&nbsp;: prise de licence fédérale incluse, certificat médical à fournir.</p>

  <div class="insc-form">
    <!-- Embed AssoConnect (formulaire de collecte / adhésion) -->
    <div class="iframe-asc-container" data-type="collect" data-collect-id="01KZPKVS8XS1RE35HZH3ZGDMY1">
      <p class="insc-fallback">Le formulaire d'inscription se charge…<br>
        S'il ne s'affiche pas, <a href="https://www.assoconnect.com/" target="_blank" rel="noopener">clique ici pour t'inscrire en ligne</a> ou contacte le secrétariat au 06&nbsp;52&nbsp;50&nbsp;10&nbsp;12.</p>
    </div>
    <!-- IMPORTANT : script d'intégration fourni par AssoConnect (onglet « Diffusion » du formulaire).
         Si le formulaire ne s'affiche pas, remplace la ligne ci-dessous par le <script> exact que te donne AssoConnect. -->
    <script src="https://embed.assoconnect.com/embed.js" async></script>
  </div>

  <p class="insc-help">Un souci pour t'inscrire&nbsp;? Contacte-nous au <a href="tel:+33652501012">06 52 50 10 12</a> / <a href="tel:+33679220967">06 79 22 09 67</a> ou passe à la salle — Espace Maison Blanche, 2 avenue Saint-Exupéry, 92320 Châtillon (3ᵉ étage).</p>
</main>

</body>
</html>
