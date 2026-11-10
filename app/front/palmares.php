<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Palmarès des combattants — Châtillon Boxing Club (ACSC92)</title>
<link rel="icon" href="img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png">
<meta name="description" content="Palmarès des combattants et coachs du Châtillon Boxing Club (ACSC92) : titres, championnats et nombre de combats.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=Barlow+Semi+Condensed:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<style>
  :root{--navy:#141a37;--navy-2:#1b2247;}
  body.palmares{background:linear-gradient(180deg,#0d1128 0%,var(--bg) 100%);min-height:100vh}
  .pal-header{position:sticky;top:0;z-index:40;background:#0d1128;border-bottom:1px solid var(--line);box-shadow:0 12px 30px rgba(0,0,0,.4)}
  .pal-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;
    padding:.9rem clamp(1rem,4vw,2.5rem)}
  .pal-top .brand{display:flex;align-items:center;gap:.7rem;font-family:var(--util);font-weight:700;letter-spacing:.04em;color:var(--text);text-decoration:none;text-transform:uppercase;font-size:.95rem}
  .pal-top .brand img{width:34px;height:34px;border-radius:50%}
  .pal-back{font-family:var(--util);text-transform:uppercase;letter-spacing:.05em;font-size:.8rem;font-weight:700;color:var(--text);
    text-decoration:none;border:1px solid var(--line);padding:.5rem .9rem;border-radius:6px;transition:.2s}
  .pal-back:hover{border-color:var(--red);color:var(--red-bright)}
  .pal-hero{max-width:1000px;margin:0 auto;padding:clamp(1.2rem,3.5vw,2rem) clamp(1rem,4vw,2rem) clamp(1.2rem,3vw,1.6rem)}
  .pal-hero .eyebrow{font-family:var(--util);text-transform:uppercase;letter-spacing:.18em;font-size:.8rem;font-weight:700;color:var(--red-bright);display:flex;align-items:center;gap:.6rem}
  .pal-hero .eyebrow::before{content:"";width:34px;height:2px;background:var(--red)}
  .pal-hero h1{font-family:"Anton",sans-serif;font-size:clamp(2.2rem,7vw,3.8rem);line-height:.95;margin:.4rem 0 .5rem;text-transform:uppercase;color:var(--text)}
  .pal-hero p{color:var(--muted);max-width:60ch;line-height:1.55}
  .pal-list{max-width:1000px;margin:0 auto;padding:1.5rem clamp(1rem,4vw,2rem) 4rem;display:flex;flex-direction:column;gap:1.2rem}
  .pfiche{display:grid;grid-template-columns:auto 1fr;gap:clamp(1.1rem,3vw,2rem);align-items:start;
    background:var(--navy);border:1px solid #29315c;border-left:3px solid var(--red);border-radius:10px;padding:clamp(1.2rem,3vw,1.8rem)}
  .pphoto{width:clamp(84px,18vw,120px);height:clamp(84px,18vw,120px);border-radius:50%;overflow:hidden;flex:0 0 auto;border:2px solid #33407a}
  .pphoto img{width:100%;height:100%;object-fit:cover;object-position:center 15%}
  .pname{font-family:"Anton",sans-serif;font-size:clamp(1.5rem,4.5vw,2.2rem);text-transform:uppercase;color:var(--text);line-height:1;margin-bottom:.6rem}
  .pcombats{display:inline-flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.9rem}
  .pcombats span{background:var(--red);color:#fff;font-family:var(--util);font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:.72rem;padding:.28rem .6rem;border-radius:4px}
  .pdisc{margin-top:.85rem}
  .plabel{display:inline-block;font-family:"Barlow Semi Condensed",monospace;letter-spacing:.18em;text-transform:uppercase;font-size:.74rem;font-weight:700;
    color:var(--text);border:1px solid #3a4680;border-radius:4px;padding:.22rem .55rem;margin-bottom:.5rem}
  .pdisc ul{list-style:none;margin:0 0 .2rem;padding:0}
  .pdisc li{position:relative;padding-left:1rem;color:#cdd3e4;font-size:.93rem;line-height:1.5;margin-bottom:.18rem}
  .pdisc li::before{content:"";position:absolute;left:0;top:.62em;width:5px;height:5px;background:var(--red);border-radius:50%}
  .palso{color:var(--muted);font-size:.9rem;margin-top:.3rem}
  .palso b{color:#cdd3e4;font-weight:600}
  .pal-foot{text-align:center;padding:0 1rem 3.5rem}
  .pal-foot a{font-family:var(--util);text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:var(--text);text-decoration:none;border:1px solid var(--line);padding:.7rem 1.3rem;border-radius:6px;transition:.2s}
  .pal-foot a:hover{border-color:var(--red);color:var(--red-bright)}
  @media(max-width:560px){.pfiche{grid-template-columns:1fr;justify-items:center;text-align:center}
    .pcombats{justify-content:center}.plabel{margin-left:auto;margin-right:auto}
    .pdisc{width:100%}.pdisc li{text-align:left}
    .pal-hero p{display:none}}
</style>
</head>
<body class="palmares">

<div class="pal-header">
  <div class="pal-top">
    <a href="index.html" class="brand"><img src="img/logo-acsc92.png" alt="ACSC92">Châtillon Boxing Club</a>
    <a href="index.html#coachs" class="pal-back">← Retour au site</a>
  </div>
  <section class="pal-hero">
    <div class="eyebrow">Nos combattants</div>
    <h1>Palmarès</h1>
    <p>Titres, championnats et parcours de nos coachs et combattants. Un héritage de la compétition de haut niveau, transmis chaque semaine sur les tapis du club.</p>
  </section>
</div>

<main class="pal-list">

  <article class="pfiche">
    <div class="pphoto"><img src="img/aurelien.jpg" alt="Aurélien"></div>
    <div class="pbody">
      <h2 class="pname">Aurélien</h2>
      <div class="pcombats"><span>120 combats</span></div>
      <div class="pdisc">
        <span class="plabel">Kickboxing</span>
        <ul>
          <li>Champion de France en 1992, 1993 et 1994</li>
          <li>Champion d'Europe en 1994</li>
          <li>Champion du monde en 1997, 1999, 2004 et 2006</li>
        </ul>
      </div>
      <div class="pdisc">
        <span class="plabel">Muay Thaï</span>
        <ul>
          <li>Champion d'Europe en 1994 et 1995</li>
          <li>Champion du monde en 1996 et 2000</li>
        </ul>
      </div>
    </div>
  </article>

  <article class="pfiche">
    <div class="pphoto"><img src="img/paolo.jpg" alt="Paolo"></div>
    <div class="pbody">
      <h2 class="pname">Paolo</h2>
      <div class="pcombats"><span>89 combats</span></div>
      <div class="pdisc">
        <span class="plabel">Kickboxing</span>
        <ul>
          <li>5 fois Champion de France</li>
          <li>3 fois Champion IDF Classe C</li>
          <li>Champion d'Europe Classe A</li>
          <li>Médaille de bronze aux Championnats du Monde Classe A</li>
        </ul>
      </div>
      <p class="palso"><b>Autres disciplines :</b> Muay Thaï · Boxe française · Jujitsu</p>
    </div>
  </article>

  <article class="pfiche">
    <div class="pphoto"><img src="img/baptiste.jpg" alt="Baptiste"></div>
    <div class="pbody">
      <h2 class="pname">Baptiste</h2>
      <div class="pcombats"><span>15 combats</span><span>60 assauts</span></div>
      <div class="pdisc">
        <span class="plabel">Kickboxing</span>
        <ul>
          <li>Vainqueur Coupe de France K1 Light –69 kg FFKMDA (2026)</li>
          <li>Vice-Champion de France Kick Light –65 kg FKBDA (2026)</li>
          <li>Champion d'Europe Kick &amp; K1 Light –65 kg WBFC (2026)</li>
          <li>Champion IDF Kick Light –69 kg FFKMDA (2025)</li>
          <li>Vice-Champion IDF K1 Light –69 kg FFKMDA (2025)</li>
          <li>2ᵉ Open Monde K1 et Full –65 kg WMAC (2024)</li>
          <li>Champion du Monde K1 –65 kg WMAC (2024)</li>
          <li>Vainqueur Coupe de France Full Contact –67 kg FFKMDA (2023)</li>
          <li>Vice-Champion de France Karaté Light et Semi –68 kg FFKDA (2022)</li>
          <li>Vice-Champion Open International Karaté Light –68 kg FFKDA (2020)</li>
        </ul>
      </div>
    </div>
  </article>

  <article class="pfiche">
    <div class="pphoto"><img src="img/issa.jpg" alt="Issa"></div>
    <div class="pbody">
      <h2 class="pname">Issa</h2>
      <div class="pdisc">
        <span class="plabel">Muay Thaï</span>
        <ul>
          <li>Champion de France de 2006 à 2017 (amateurs)</li>
          <li>Champion IDF de 2006 à 2017</li>
          <li>Champion de Picardie 2011</li>
          <li>Vice-champion du monde IFMA 2013</li>
        </ul>
      </div>
    </div>
  </article>

  <article class="pfiche">
    <div class="pphoto"><img src="img/jerome.jpg" alt="Jérôme"></div>
    <div class="pbody">
      <h2 class="pname">Jérôme</h2>
      <div class="pdisc">
        <span class="plabel">Kickboxing</span>
        <ul>
          <li>3 fois Champion de France</li>
        </ul>
      </div>
      <div class="pdisc">
        <span class="plabel">Boxe française</span>
        <ul>
          <li>Champion de France en 1994</li>
          <li>Vainqueur de la Coupe de France Kicklight 2024</li>
        </ul>
      </div>
      <p class="palso"><b>Autres disciplines :</b> Muay Thaï</p>
    </div>
  </article>

  <article class="pfiche">
    <div class="pphoto"><img src="img/cyril.jpg" alt="Cyril"></div>
    <div class="pbody">
      <h2 class="pname">Cyril</h2>
      <div class="pcombats"><span>13 combats</span><span>35 assauts</span></div>
      <div class="pdisc">
        <span class="plabel">Muay Thaï · Kickboxing</span>
        <ul>
          <li>Champion de France K1 Light FFKMDA 2023</li>
          <li>Champion de France Kick Light FKBDA 2025</li>
          <li>3ᵉ au Championnat du Monde Muay Thaï plein WMF 2026</li>
          <li>Vice-champion du monde Kick Light élite WMAC 2025</li>
          <li>Vice-champion du monde Light Contact élite WMAC 2025</li>
        </ul>
      </div>
    </div>
  </article>


  <article class="pfiche">
    <div class="pphoto"><img src="img/paul.jpg" alt="Paul"></div>
    <div class="pbody">
      <h2 class="pname">Paul</h2>
      <div class="pcombats"><span>45 combats</span></div>
      <div class="pdisc">
        <span class="plabel">Kickboxing</span>
        <ul>
          <li>3 fois Champion de France</li>
          <li>3 fois Vice-Champion de France</li>
        </ul>
      </div>
    </div>
  </article>


</main>

<div class="pal-foot">
  <a href="index.html#coachs">← Retour à l'équipe</a>
</div>

</body>
</html>
