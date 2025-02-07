<template>
  <div class="main-container">
    <!-- Reference Number Dialog -->
    <q-dialog
      v-model="showDialog"
      persistent
      style="background-color: rgba(0, 0, 0, 1)"
    >
      <q-card class="ref-card">
        <div class="row">
          <div class="col-md-6 col-sm-12 q-pa-lg">
            <div class="text-h6 lexend-font text-white q-mt-sm q-mb-md q-ml-sm">
              <span class="bg-black q-pa-sm text-weight-bold"
                >Cotton <span class="text-yellow">Care</span></span
              >
            </div>
            <div
              class="text-ref-title dynapuff-font text-h2 text-left text-uppercase q-mb-md q-ml-sm"
            >
              Minesweeper Challenge
            </div>
            <div class="text-h6 lexend-font text-white q-mt-sm q-mb-md q-ml-sm">
              Pick a box and get a chance to win a discount! Be careful of the
              bombs, they are tricky!
            </div>
            <q-img src="@/assets/img.png" spinner-color="white" />
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
                placeholder="Enter your reference number here..."
                dense
              />
              <div class="text-caption text-white lexend-font q-mt-sm">
                <span class="text-pink-4">NOTE:</span> You can only enter the
                game once. Once you enter the game, you cannot reuse your
                reference code. Use it wisely.
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

    <!-- Game UI -->
    <div v-if="isLoading">Checking your reference number...</div>
    <div v-else-if="!isTokenValid"></div>
    <div v-else class="main-game">
      <div class="row">
        <div class="col-6 q-px-md q-pt-xl">
          <div class="text-white text-center lexend-font text-h2 q-ma-lg">
            <!-- Welcome to the Cotton Care Minesweeper Challenge -->
          </div>
          <q-img
            class=""
            src="@/assets/title.png"
            loading="lazy"
            spinner-color="white"
          />
          <div class="row justify-center">
            <q-btn
              push
              class="lexend-font bg-primary main-btn"
              @click="showHowToPlay = true"
            >
              How To Play?
            </q-btn>
            <q-btn
              push
              class="lexend-font bg-primary main-btn"
              @click="showPrizes = true"
            >
              What Do I Get?
            </q-btn>
          </div>
        </div>

        <div class="col-6">
          <div
            class="row justify-center items-center text-center text-weight-bolder lexend-font q-mb-sm q-mt-lg"
          >
            <q-card class="counter q-pt-sm">
              <div class="text-caption">Chances Left</div>
              <div class="text-h6">{{ unrevealedCells }}</div>
            </q-card>
            <!-- <q-img class="title-img" src="@/assets/title.png" spinner-color="white" /> -->
            <q-img
              class="title-img"
              src="@/assets/img.png"
              spinner-color="white"
            />
            <q-card class="counter q-pt-sm">
              <div class="text-caption">Prizes Left</div>
              <div class="text-h6">{{ nonBombCells }}</div>
            </q-card>
          </div>

          <div class="row justify-center">
            <div class="gridM">
              <div
                v-for="(rowM, rowIndex) in board"
                :key="rowIndex"
                class="rowM"
              >
                <q-btn
                  v-for="(cellM, colIndex) in rowM"
                  :key="colIndex"
                  :color="
                    cellM.revealed
                      ? cellM.mine
                        ? 'red'
                        : cellM.cellValue === 1
                        ? 'purple'
                        : cellM.cellValue === 2
                        ? 'green'
                        : cellM.cellValue === 3
                        ? 'blue'
                        : 'grey'
                      : 'grey'
                  "
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
                  class="cellM dynapuff-font"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How to Play Dialog -->
    <q-dialog class="game-dialog" v-model="showHowToPlay">
      <q-card class="game-card text-white lexend-font">
        <!-- Close (X) Button at the Top Right -->
        <div class="row justify-end">
          <q-btn
            dense
            icon="close"
            color="white"
            @click="showHowToPlay = false"
            class="bg-red"
          />
        </div>

        <q-card-container class="q-pa-md">
          <!-- Title -->
          <div class="text-h5 text-bold text-primary text-center q-mb-md">
            🎮 How to Play the Minesweeper Challenge 🎮
          </div>

          <!-- Instructions -->
          <q-list dense>
            <q-item
              ><q-item-section
                >1️⃣ Each player picks only **one cell** using their reference
                number.</q-item-section
              ></q-item
            >
            <q-item
              ><q-item-section
                >2️⃣ If your cell contains a **bomb (💣, red)**, you
                lose!</q-item-section
              ></q-item
            >
            <q-item
              ><q-item-section
                >3️⃣ If your cell shows a **number**, it tells you how many bombs
                are around it.</q-item-section
              ></q-item
            >
            <q-item
              ><q-item-section
                >4️⃣ **The game is continuous!** Picked cells stay
                revealed.</q-item-section
              ></q-item
            >
            <q-item
              ><q-item-section
                >5️⃣ **Game ends when all 100 cells are picked.** Choose wisely!
                🎯</q-item-section
              ></q-item
            >
          </q-list>
        </q-card-container>
      </q-card>
    </q-dialog>

    <!-- Prize System Dialog -->
    <q-dialog class="game-dialog" v-model="showPrizes">
      <q-card class="game-card lexend-font">
        <!-- Close (X) Button at the Top Right -->
        <div class="float-right">
          <q-btn
            dense
            icon="close"
            color="white"
            @click="showPrizes = false"
            class="bg-red"
          />
        </div>
        <!-- <div class="text-h5 text-bold text-center">🏆 Prize System</div>
        <q-list dense>
          <q-item><q-item-section>🟣 **Violet (1st Prize - Value = 1)** → 🎉 **Top reward!**</q-item-section></q-item>
          <q-item><q-item-section>🟢 **Green (2nd Prize - Value = 2)** → 🥈 **Great prize!**</q-item-section></q-item>
          <q-item><q-item-section>🔵 **Blue (3rd Prize - Value = 3)** → 🥉 **Still a winner!**</q-item-section></q-item>
          <q-item><q-item-section>💣 **Red (Value = 0) is a bomb – avoid it!**</q-item-section></q-item>
        </q-list> -->
        <q-card-container class="q-pa-md"></q-card-container>
        <q-img class="" src="@/assets/prizes.png" spinner-color="white" />
      </q-card>
    </q-dialog>
    <!-- Bomb Dialog (Shows 0.png when a bomb is picked) -->
    <q-dialog class="bomb-dialog" v-model="showBombDialog" persistent>
      <q-card flat class="bomb-card">
      <div class="text-h6 text-center text-white">You picked cell #{{ pickedCellId }}</div>

        <!-- Close (X) Button -->
        <!-- <div class="row justify-end">
      <q-btn dense icon="close" color="white" @click="showBombDialog = false" class="bg-red" />
    </div> -->

        <!-- Bomb Image -->
        <!-- <q-img src="@/assets/0.png" spinner-color="white" class="bomb-image" /> -->
      </q-card>
    </q-dialog>

    <q-dialog class="one-dialog" v-model="showOneDialog" persistent>
      <q-card flat class="one-card">
        <div class="text-h6 text-center text-white">You picked cell #{{ pickedCellId }}</div>
      </q-card>
    </q-dialog>

    <q-dialog class="two-dialog" v-model="showTwoDialog" persistent>
      <q-card flat class="two-card">
        <div class="text-h6 text-center text-white">You picked cell #{{ pickedCellId }}</div>
      </q-card>
    </q-dialog>

    <q-dialog class="three-dialog" v-model="showThreeDialog" persistent>
      <q-card flat class="three-card">
        <div class="text-h6 text-center text-white">You picked cell #{{ pickedCellId }}</div>
      </q-card>
    </q-dialog>
  </div>
  <div class="bg-black text-white lexend-font text-center q-pa-sm text-caption">
    <div>
      Developed by
      <a
        class="text-teal"
        href="https://www.azaza.com.sg"
        target="_blank"
        rel="noopener noreferrer"
      >
        Azaza Biz Solutions, Inc.
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  checkReference,
  fetchMines,
  updateMineStatus,
  updateCellStatus,
} from "@/../supabase/api.js";

const rows = 10;
const cols = 10;
const board = ref([]);
const isLoading = ref(false);
const isTokenValid = ref(false);
const showDialog = ref(true);
const referenceNo = ref("");
const errorMessage = ref("");

const initializeBoard = async () => {
  // Create an empty board
  board.value = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      neighborMines: 0,
    }))
  );

  await fetchAndPlaceMines(); // Fetch mines from DB and place them
};

const fetchAndPlaceMines = async () => {
  const mines = await fetchMines(); // Fetch all mines from database

  if (!mines.length) {
    console.error("No mines found in database!");
    return;
  }

  // 🏗 Step 1: Map database mines to the board
  mines.forEach((mine) => {
    const id = mine.id - 1; // Convert ID (1-based) to array index (0-based)
    const x = Math.floor(id / cols); // Row index
    const y = id % cols; // Column index

    if (x >= 0 && y >= 0 && x < rows && y < cols) {
      board.value[x][y].mine = mine.value === 0; // 0 means bomb
      board.value[x][y].neighborMines = mine.value; // Assign database value
      board.value[x][y].revealed = mine.status; // Reveal if status = true
      board.value[x][y].cellValue = mine.value; // Store the actual value from DB
    }
  });

  calculateNeighbors(); // Recalculate neighbor counts
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

// const revealCell = async (x, y) => {
//   if (board.value[x][y].revealed) return; // Prevent duplicate clicks

//   board.value[x][y].revealed = true; // Reveal the cell

//   // Find the corresponding mine ID using its position
//   const cellId = x * cols + y + 1; // Convert (x, y) to ID (assuming ID starts from 1)

//   // Update database status
//   await updateCellStatus(cellId, true);
// };

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
    await initializeBoard();
  } else {
    errorMessage.value = "Invalid or expired reference number.";
  }
  isLoading.value = false;
};

// Counts unrevealed cells
const unrevealedCells = computed(() => {
  return board.value.flat().filter((cell) => !cell.revealed).length;
});

// Counts non-bomb cells
const nonBombCells = computed(() => {
  return board.value.flat().filter((cell) => cell.cellValue !== 0 && !cell.revealed).length;
});


const showHowToPlay = ref(false);
const showPrizes = ref(false);

const showOneDialog = ref(false);
const showTwoDialog = ref(false);
const showThreeDialog = ref(false);
const showBombDialog = ref(false);

const pickedCellId = ref(null); // Stores the picked cell ID

const revealCell = async (x, y) => {
  if (board.value[x][y].revealed) return; // Prevent duplicate clicks

  board.value[x][y].revealed = true; // Reveal the cell
  pickedCellId.value = x * cols + y + 1; // Store the clicked cell ID (convert x, y to ID)

  // Determine which dialog to show based on cell value
  if (board.value[x][y].mine) {
    showBombDialog.value = true; // Bomb dialog
  } else if (board.value[x][y].cellValue === 1) {
    showOneDialog.value = true; // 1st prize dialog
  } else if (board.value[x][y].cellValue === 2) {
    showTwoDialog.value = true; // 2nd prize dialog
  } else if (board.value[x][y].cellValue === 3) {
    showThreeDialog.value = true; // 3rd prize dialog
  }

  // Update database status
  await updateCellStatus(pickedCellId.value, true);
};


</script>
