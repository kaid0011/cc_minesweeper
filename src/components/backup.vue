<template>
  <div class="q-pa-md atma-regular">
    <q-dialog
    v-model="showDialog"
    persistent
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <q-card class="ref-card">
      <div class="row">
        <div class="col-md-6 col-sm-12 q-pa-lg">
          <div class="text-caption lexend-font text-white q-mt-sm q-mb-md">
            By Cotton Care
          </div>
          <div
            class="text-ref-title dynapuff-font text-h2 text-left text-uppercase q-mb-md"
          >
            Minesweeper Challenge
          </div>
          <div class="text-h6 lexend-font text-white q-mt-sm q-mb-md">
            Pick a box and get a chance to win a discount! Becareful of the
            bombs, they are tricky!
          </div>
          <div>
            <q-img
              src="@/assets/1.png"
              spinner-color="white"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-12 q-pa-lg justify-center">
         <q-card class="right-container q-pa-lg">
          <div class="text-h6 lexend-font text-pink-4 q-mt-sm q-mb-md">
            One of the loyal customers invited? Enter your reference code to
            play the game!
          </div>
  
          <q-input
            style="font-size: 20px"
            class="bg-white"
            outlined
            v-model="referenceNo"
            placeholder="Enter you reference number here..."
            dense
          />
          <div class="text-caption text-white lexend-font q-mt-sm">
            <span class="text-pink-4">NOTE: </span>You can only enter the game
            once. Once you enter the game, you cannot reuse your reference
            code. Use it wisely.
          </div>
          <q-btn
            class="ref-btn full-width q-my-lg"
            label="Submit"
            color="primary"
            @click="checkReferenceNo"
          />
         </q-card>
        </div>
      </div>
    </q-card>
  </q-dialog>
  

    <div v-if="isLoading">Checking your reference number...</div>
    <div v-else-if="!isTokenValid"></div>
    <div v-else class="row justify-center">
      <div class="gridM">
        <div v-for="(rowM, rowIndex) in board" :key="rowIndex" class="rowM">
          <q-btn
            v-for="(cellM, colIndex) in rowM"
            :key="colIndex"
            :color="cellM.revealed ? (cellM.mine ? 'red' : 'grey') : 'yellow-8'"
            :label="
            cellM.revealed
                ? cellM.mine
                  ? '💣'
                  : cellM.neighborMines > 0
                  ? cellM.neighborMines
                  : ''
                : ''
            "
            @click="revealCell(rowIndex, colIndex)"
            class="cellM"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { checkReference } from "@/../supabase/api.js";

const rows = 10;
const cols = 10;
const board = ref([]);
const isLoading = ref(false);
const isTokenValid = ref(false);
const showDialog = ref(true);
const referenceNo = ref("");
const errorMessage = ref("");

const getMinesFromEnv = () => {
  const envMines = import.meta.env.VITE_MINES || "";
  return envMines
    ? envMines.split(";").map((coord) => {
        const [x, y] = coord.split(",").map(Number);
        return { x, y };
      })
    : [];
};

const initializeBoard = () => {
  board.value = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      neighborMines: 0,
    }))
  );
  placeMines();
};

const placeMines = () => {
  const minePositions = getMinesFromEnv();
  minePositions.forEach(({ x, y }) => {
    if (x >= 0 && y >= 0 && x < rows && y < cols) {
      board.value[x][y].mine = true;
    }
  });
  calculateNeighbors();
};

const calculateNeighbors = () => {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (board.value[x][y].mine) continue;
      let count = 0;
      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < rows &&
            ny < cols &&
            board.value[nx][ny].mine
          ) {
            count++;
          }
        }
      }
      board.value[x][y].neighborMines = count;
    }
  }
};

const revealCell = (x, y) => {
  if (board.value[x][y].revealed) return;
  board.value[x][y].revealed = true;
};

const checkReferenceNo = async () => {
  if (!referenceNo.value) {
    errorMessage.value = "Reference number is required";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  const isValid = await checkReference(referenceNo.value);
  if (isValid) {
    isTokenValid.value = true;
    showDialog.value = false;
    initializeBoard();
  } else {
    errorMessage.value = "Invalid or expired reference number.";
  }
  isLoading.value = false;
};
</script>
