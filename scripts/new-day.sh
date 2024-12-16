#! /bin/bash

INDEX_FILE="src/index.js"
DATA_DIR="src/data"
SOLUTIONS_DIR="src/solutions"
DAY_PREFIX="day"

main() {
  local day=$1

  assert_day_provided "$day"
  assert_day_not_exists "$day"

  create_data_file "$day"
  create_js_file "$day"
  set_day_as_default "$day"

  echo "Day ${day} added successfully"
}

assert_day_provided() {
  local day=$1
  if [[ -z "$day" ]]; then
    echo "No day was provided" >&2
    exit 1
  fi

  if [[ ! "$day" =~ ^[0-9]+$ ]] || [[ "$day" == "0" ]]; then
    echo "Day must be a a positive integer" >&2
    exit 1
  fi
}

assert_day_not_exists() {
  local day=$1
  if [[ -f "${DATA_DIR}/${DAY_PREFIX}${day}.txt" ]]; then
    echo "Day ${day} already exists"
    exit 1
  fi
}

create_data_file() {
  local day=$1
  touch "${DATA_DIR}/${DAY_PREFIX}${day}.txt"
}

create_js_file() {
  local day=$1
  local js_file="${SOLUTIONS_DIR}/${DAY_PREFIX}${day}.js"

  touch "$js_file"

  echo -e "import { getInput } from \"../utils.js\";" >> "$js_file"
  echo -e "\nlet input = await getInput(${day});" >> "$js_file"
  echo -e "\nconsole.log(input);" >> "$js_file"
}

set_day_as_default() {
  local day="$1"
  local temp_index_file="$(mktemp)"
  local imported=0
  local current_line
  local current_day

  local new_import="import \"./$(echo "$SOLUTIONS_DIR" | sed -e "s/src\///")/${DAY_PREFIX}${day}.js\";"

  while IFS="" read -r line || [ -n "$line" ]
  do
    if [[ "$line" =~ day([0-9]+)\.js ]]; then
      current_day="${BASH_REMATCH[1]}"
      
      if [[ "$line" =~ ^import ]]; then
        line="// $line"
      fi

      if ((imported == 0 && current_day > day)); then
        echo "$new_import" >> "$temp_index_file"
        imported=1
      fi
    fi

    echo "$line" >> "$temp_index_file"
  done < "$INDEX_FILE"

  # If the new import wasn't inserted, add it at the end
  if ((imported == 0)); then
    echo "$new_import" >> "$temp_index_file"
  fi

  mv "$temp_index_file" "$INDEX_FILE"
}

main "$@"
