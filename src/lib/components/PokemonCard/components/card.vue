<template>
  <div class="card"
       :class="{ active, interacting, image__loading: imageLoading, card__loading: cardLoading }"
       ref="card"
       :style="styles"
       :data-subtypes="subtypes"
       :data-supertype="supertype"
       :data-rarity="rarity"
       :data-gallery="gallery">
    <div class="card__translater">
      <button class="card__rotator"
              ref="rotator"
              @pointermove="interact"
              @mouseout="interactEnd">
        <img class="card__back"
             :src="back_img" />
        <div class="card__front">
          <img :src="front_img"
               v-on:load="imageLoader" />
          <card-shine :subtypes="subtypes"
                      :supertype="supertype" />
          <card-glare :subtypes="subtypes"
                      :rarity="rarity" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, watchEffect } from 'vue'
import { useSpring } from "@vueuse/motion";
import { clamp, round } from "../helpers/Math";
import CardShine from "./card-shine.vue";
import CardGlare from "./card-glare.vue";
import back_img from "../assets/img/tcg-card-back-2x.jpg";

const galaxyPosition = Math.floor(Math.random() * 1500);

type supertype = 'Pokémon' | 'Trainer';
type subtype = 'Basic' | 'Supporter' | 'Stage 1' | 'Stage 2' | 'V' | 'Fusion Strike' | 'VMAX' | 'Single Strike' | 'Rapid Strike' | 'VSTAR' | 'Stadium' | 'Item' | 'Pokémon Tool';
type rarity = 'Common' | 'Uncommon' | 'Rare Holo' | 'Rare Holo Galaxy' | 'Radiant Rare' | 'Rare Holo V' | 'Rare Ultra' | 'Rare Holo VMAX' | 'Rare Rainbow Alt' | 'Rare Holo VSTAR' | 'Rare Rainbow' | 'Rare Secret';
export type card = {
  id: string;
  name: string;
  supertype: supertype;
  subtypes: subtype[];
  number: string;
  rarity: rarity;
  cardLoading: boolean;
  images: {
    small: string,
    large: string
  }
}

const props = defineProps([
  'img',
  'name',
  'supertype',
  'backimg',
  'subtypes',
  'rarity',
  'gallery',
  'active',
  'cardLoading'
])

const card = ref<Element | null>(null)
const rotator = ref(null)

const springR = { stiffness: 666, damping: 25 }
const springD = { stiffness: 333, damping: 45 }

const springRotateRef = ref({ x: 0, y: 0 })
const springGlareRef = ref({ x: 50, y: 50, o: 0 })
const springBackgroundRef = ref({ x: 50, y: 50 })
const springRotateDeltaRef = ref({ x: 0, y: 0 })
const springTranslateRef = ref({ x: 0, y: 0 })
const springScaleRef = ref({ s: 1 })

const getSpringControls = (ref: any, config: any) => {
  const spring = useSpring(ref.value, config)
  return spring as any
}

const springRotate = getSpringControls(springRotateRef, springR)
const springGlare = getSpringControls(springGlareRef, springR)
const springBackground = getSpringControls(springBackgroundRef, springR)

const springRotateDelta = getSpringControls(springRotateDeltaRef, springD)
const springTranslate = getSpringControls(springTranslateRef, springD)
const springScale = getSpringControls(springScaleRef, springD)

const firstPop = ref(true)
const interacting = ref(false)
const imageLoading = ref(true)
const debounce = ref<NodeJS.Timeout | number>(0)
const front_img = ref("")

const styles = ref()

watchEffect(() => {
  styles.value = `
		--mx: ${springGlare.values.x}%;
		--my: ${springGlare.values.y}%;
		--tx: ${springTranslate.values.x}px;
		--ty: ${springTranslate.values.y}px;
		--s: ${springScale.values.s};
		--o: ${springGlare.values.o};
		--rx: ${springRotate.values.x + springRotateDelta.values.x}deg;
		--ry: ${springRotate.values.y + springRotateDelta.values.y}deg;
		--pos: ${springBackground.values.x}% ${springBackground.values.y}%;
		--posx: ${springBackground.values.x}%;
		--posy: ${springBackground.values.y}%;
		--hyp: ${clamp(
    Math.sqrt(
      (springGlare.values.y - 50) * (springGlare.values.y - 50) +
      (springGlare.values.x - 50) * (springGlare.values.x - 50)
    ) / 50,
    0,
    1
  )};
    --galaxybg: center ${galaxyPosition}px;
	  `
})

const setCenter = () => {
  if (!card.value) return
  const rect = card.value.getBoundingClientRect(); // get element's size/position
  const view = document.documentElement; // get window/viewport size

  const delta = {
    x: round(view.clientWidth / 2 - rect.x - rect.width / 2),
    y: round(view.clientHeight / 2 - rect.y - rect.height / 2),
  };
  springTranslate.set({
    x: delta.x,
    y: delta.y,
  });
}

const reposition = () => {
  clearTimeout(debounce.value);
  debounce.value = setTimeout(() => {
    if (props.active) {
      setCenter();
    }
  }, 300);
}

const interact = (e: any) => {
  if (props.active) {
    interacting.value = true;
  }

  if (e.type === "touchmove") {
    e.clientX = e.touches[0].clientX;
    e.clientY = e.touches[0].clientY;
  }

  const $el = e.target;
  const rect = $el.getBoundingClientRect(); // get element's current size/position
  const absolute = {
    x: e.clientX - rect.left, // get mouse position from left
    y: e.clientY - rect.top, // get mouse position from right
  };
  const percent = {
    x: round((100 / rect.width) * absolute.x),
    y: round((100 / rect.height) * absolute.y),
  };
  const center = {
    x: percent.x - 50,
    y: percent.y - 50,
  };

  springBackground.values.stiffness = springR.stiffness;
  springBackground.values.damping = springR.damping;
  springBackground.set({
    x: round(50 + percent.x / 4 - 12.5),
    y: round(50 + percent.y / 3 - 16.67),
  });
  springRotate.values.stiffness = springR.stiffness;
  springRotate.values.damping = springR.damping;
  springRotate.set({
    x: round(-(center.x / 3.5)),
    y: round(center.y / 2),
  });
  springGlare.values.stiffness = springR.stiffness;
  springGlare.values.damping = springR.damping;
  springGlare.set({
    x: percent.x,
    y: percent.y,
    o: 1,
  });
}

const imageLoader = () => {
  imageLoading.value = false;
}

const interactEnd = (e: any, delay = 100) => {
  setTimeout(() => {
    const snapStiff = 0.01;
    const snapDamp = 0.06;
    interacting.value = false;

    springRotate.values.stiffness = snapStiff;
    springRotate.values.damping = snapDamp;
    springRotate.set({ x: 0, y: 0 });

    springGlare.values.stiffness = snapStiff;
    springGlare.values.damping = snapDamp;
    springGlare.set({ x: 50, y: 50, o: 0 });

    springBackground.values.stiffness = snapStiff;
    springBackground.values.damping = snapDamp;
    springBackground.set({ x: 50, y: 50 });
  }, delay);
}

const _setCenter = () => {
  if (!card.value) return
  const rect = card.value.getBoundingClientRect(); // get element's size/position
  const view = document.documentElement; // get window/viewport size
  const delta = {
    x: round(view.clientWidth / 2 - rect.x - rect.width / 2),
    y: round(view.clientHeight / 2 - rect.y - rect.height / 2),
  };
  springTranslate.set({
    x: delta.x,
    y: delta.y,
  });
}

const _popover = () => {
  if (!card.value) return
  const rect = card.value.getBoundingClientRect(); // get element's size/position
  let delay = 100;
  let scaleW = (window.innerWidth / rect.width) * 0.9;
  let scaleH = (window.innerHeight / rect.height) * 0.9;
  let scaleF = 1.75;
  _setCenter();
  if (firstPop.value) {
    delay = 1000;
    springRotateDelta.set({
      x: 360,
      y: 0,
    });
    firstPop.value = false;
  }
  springScale.set({ s: Math.min(scaleW, scaleH, scaleF) });
  interactEnd(null, delay);
}

const _retreat = () => {
  springScale.set({ s: 1 });
  springTranslate.set({ x: 0, y: 0 });
  springRotateDelta.set({ x: 0, y: 0 });
  interactEnd(null, 100);
}

watch(
  () => props.active,
  (isActive, wasActive) => {
    if (isActive !== wasActive) {
      if (isActive) {
        _popover();
      } else {
        _retreat();
      }
    }
  }, { immediate: false }
)

onMounted(() => {
  const img_base = props.img.startsWith("http")
    ? ""
    : "https://images.pokemontcg.io/";
  front_img.value = img_base + props.img;

  if (props.backimg) {
    back_img.value = props.backimg;
  }

  window.addEventListener("scroll", reposition, true);
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", reposition);
})
</script>

<style lang="less" scoped>
@import "../assets/css/cards.less";

:root {
  --mx: 50%;
  --my: 50%;
  --s: 1;
  --o: 0;
  --tx: 0px;
  --ty: 0px;
  --rx: 0deg;
  --ry: 0deg;
  --pos: 50% 50%;
  --posx: 50%;
  --posy: 50%;
  --hyp: 0;
}

.card {
  --radius: 4.55% / 3.5%;
  --back: #004177;
  --glow: #69d1e9;
  z-index: calc(var(--s) * 100);
  transform: translate3d(0, 0, 0.1px);
  will-change: transform, visibility;
  transform-style: preserve-3d;
  width: 300px;

  &.interacting {
    z-index: calc(var(--s) * 120);
  }

  &.active {

    .card__translater,
    .card__rotator {
      touch-action: none;
    }

    .card__rotator {
      box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow),
        0 0 30px 0px var(--glow);
    }

    .card__rotator:focus {
      box-shadow: 0px 10px 30px 3px black;
    }
  }

  &.image__loading {
    .card__front {
      opacity: 0;
    }

    .card__back {
      transform: rotateY(0deg);
    }
  }
}

.card__translater,
.card__rotator {
  display: grid;
  perspective: 600px;
  transform-origin: center;
  -webkit-transform-origin: center;
  will-change: transform;
}

.card__translater {
  width: auto;
  position: relative;
  transform: translate3d(var(--tx), var(--ty), 0) scale(var(--s));
  -webkit-transform: translate3d(var(--tx), var(--ty), 0) scale(var(--s));
}

.card__rotator {
  transform: rotateY(var(--rx)) rotateX(var(--ry));
  transform-style: preserve-3d;
  box-shadow: 0px 10px 20px -5px black;
  border-radius: var(--radius);
  outline: none;
  transition: box-shadow 0.4s ease, outline 0.2s ease;
  appearance: none;
  border: none;
  background: top;
  padding: 0;

  &:focus {
    box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow),
      0 0 30px 0px var(--glow);
  }

  * {
    width: 100%;
    display: grid;
    grid-area: 1/1;
    border-radius: var(--radius);
    image-rendering: optimizeQuality;
    transform-style: preserve-3d;
  }

  img {
    outline: 1px solid transparent;
    aspect-ratio: 0.716;
    height: auto;
  }

  .card__back {
    background-color: var(--back);
    transform: rotateY(180deg) translateZ(1px);
    backface-visibility: visible;
  }

  .card__front {
    opacity: 1;
    transition: opacity 0.33s ease-out;
  }
}
</style>
