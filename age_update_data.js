const fs = require('fs');
const yaml = require('js-yaml');

// Function to calculate the age based on the date of birth (DOB)
function calculateAge(dob) {
  const birthDate = new Date(dob.split('-').reverse().join('-')); // Convert DOB (dd-mm-yyyy) to Date object
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Function to read, update, and save the YAML file
function updateAgeInYaml() {
  const filePath = 'people_data.yaml';

  try {
    // Read the YAML file (synchronously)
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let data = yaml.load(fileContents);

    // If the file is empty or not an array, initialize as an empty array
    if (!Array.isArray(data)) {
      data = [];
    }

    // Loop through each person and ensure age is calculated
    data.forEach(person => {
      // If the person doesn't have a valid age, calculate and fill it
      if (!person.age || person.age === 0) {
        if (person.dob) {
          person.age = calculateAge(person.dob);
        } else {
          console.warn(`Skipping person with missing DOB: ${JSON.stringify(person)}`);
        }
      }
    });

    // Write the updated YAML back to the file
    const updatedYaml = yaml.dump(data);
    fs.writeFileSync(filePath, updatedYaml, 'utf8');

    console.log('YAML file updated successfully!');
  } catch (error) {
    console.error('Error reading or writing YAML file:', error);
  }
}

// Run the function to update the ages
updateAgeInYaml();
