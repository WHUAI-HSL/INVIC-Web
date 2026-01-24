# Lessons Learned and Development Plans by Invic Team for RoboCup 2026

**Authors:** Zhiyang Han, Jiasu Qiu, Gengyou Liu, Yilan Lyu, Qixiang Han, Xiefeng Wu, and Zhenhao Ma
**Affiliation:** Wuhan University (School of Electronic Information, School of Electrical Engineering and Automation, School of Robotics, and School of Surveying and Mapping)
**Website:** [whuai-hsl.github.io](https://whuai-hsl.github.io/)

**Abstract:**
The Invic team, affiliated with Wuhan University Student Engineering Training and Innovation Practice Center, has years of experience in the RoboCup Standard Platform League (SPL) China Open and has won multiple national-level awards. For the 2026 Humanoid Soccer League, the team plans to use the K1 platform, optimize its system targeting 6 core challenges (including ball search logic, tactical strategies, and goalkeeper decision-making), and propose development plans such as a multi-modal collaborative ball search framework. This achievement not only provides a technical reference case for the league but also facilitates talent cultivation in universities and science popularization in communities.

---

## Team Description and History

The Invic team is a multidisciplinary team with extensive competition experience, comprising students from different schools at Wuhan University. Affiliated with the Wuhan University Student Engineering Training and Innovation Practice Center, Invic is a youthful and dynamic team. The team fully leverages professional knowledge from various disciplines to spark collisions of ideas. Together, we strive to build a robot soccer team with rigorous logic, orderly actions, and tacit cooperation.

Since 2018, the team has been participating in the RoboCup China Standard Platform League (SPL). From 2018 to 2025, we have successively won numerous competition honors.

### Team Awards in RoboCup China (SPL)

| Year | Competition | Award Level |
| :--- | :--- | :--- |
| 2018 | RoboCup China (SPL) | First Prize |
| 2019 | RoboCup China (SPL) | Third Prize |
| 2020 | RoboCup China (SPL) | First Prize |
| 2021 | RoboCup China (SPL) | First Prize |
| 2022 | RoboCup China (SPL) | Second Prize |
| 2023 | RoboCup China (SPL) | Third Prize |
| 2024 | RoboCup China (SPL) | Second Prize |
| 2025 | RoboCup China (SPL) | Second Prize |

---

## Key Lessons Learned

From previous participation in RoboCup SPL, the team has gained valuable insights into robot soccer development, leveraging the B-Human framework for effective practices.

1.  **Gait Optimization & Balance**
    * Developed a double closed-loop balance system for adaptive gait adjustments using real-time IMU and joint data.
2.  **Kicking Control**
    * Enhanced kicking accuracy through a torque-kicking effect mapping and parameter optimization.
3.  **Multimodal Ball Search**
    * Upgraded multimodal ball search with combined camera and sensor data for better field adaptation.
4.  **Tactical Positioning**
    * Optimized dynamic positioning with a linked decision model tailored to field dimensions.
5.  **Goalkeeper Strategy**
    * Advanced goalkeeper strategies by extending joint angle flexibility and refining trajectory prediction for superior defense coverage.

---

## Technical Challenges and Goals

The team is focused on addressing major challenges for the upcoming competition:

* **Locomotion Stability:** Improving bipedal locomotion stability in humanoid robots.
* **Vision-Action Coupling:** Ensuring low-latency coupling between vision and action and achieving rapid target tracking in dynamic scenarios.
* **Motion Control:** Optimizing motion control algorithms for the K1 robot’s 22-degree-of-freedom structure.
* **Communication:** Adapting to GameController’s local area network communication.
* **Compliance:** Ensuring compliance with league requirements regarding robot size, sensors, and autonomous behavior.

---

## Major Improvement Plans

To address these challenges, the team has formulated five major improvement plans integrating the K1 platform’s characteristics:

### Plan 1: Design Multi-Modal Ball Search Logic
* **Strategy:** Adopts a "regional traversal and prediction" strategy.
* **Logic:** In ball-less states, the robot searches the central field first then expands to corners, predicting the ball’s position via odometry data.
* **Implementation:** Integrates the head’s ±90° pitch/yaw motion to extend visual coverage.

### Plan 2: Reconstruct Teammate Ball Possession Tracking Logic
* **Identification:** The K1’s camera identifies qualified team markers to build a dynamic teammate position map.
* **Possession Definition:** A teammate is deemed to hold the ball if within 0.5m of it and facing it, triggering a following motion.
* **Prejudgment:** The robot adjusts gait in advance when a teammate’s movements indicate a pass.

### Plan 3: Reconstruct Assist Module for Humanoid Collaboration
* **Dynamic Role Pool:** Roles (goalkeeper, striker, midfielder, defender) switch automatically per GameController state based on the K1’s Soccer Agent mode.
* **Communication:** Visual signals replace direct communication for intention transmission to resolve latency issues.

### Plan 4: Reconstruct Goalkeeper Decision-Making System
* **Objective:** Resolves goalkeeper interception, compliant ball holding, and penalty response issues.
* **Mechanics:** A high-stability, low-step-frequency close-range interception gait is designed based on the K1’s 6-DoF leg model.

### Plan 5: Optimize Kicking Motion Library
* **Development:** Various kicking motions developed with the K1 SDK, using reinforcement learning to improve motion coherence.
* **Dynamic Kick:** The dynamic ball-striking algorithm is optimized to enhance prediction and accuracy for the "Dynamic Kick from Moving Ball" challenge.

---

## Implementation Progress

Current progress on the proposed improvement plans includes:

* **Visual Detection:** Deployment and preliminary verification of basic visual detection models.
* **Ball Search:** Optimization of the ball search logic to achieve autonomous ball search functionality.
* **Communication:** Adaptation and message parsing of GameController communication.

---

## Impact and Future Work

### Impact on Humanoid Soccer League (HSL)
The team aims to offer a reusable framework for adapting SPL technologies to the HSL. The multi-modal ball search algorithm and visual collaboration mechanism developed for the K1 platform will serve as a model to help other teams transition smoothly, reducing technical barriers and promoting technology adoption.

### Impact on University and Community
By partnering with Booster, the team seeks to enhance the K1 platform’s competition readiness and bridge the gap between humanoid robot education and industry-academia-research collaboration. Activities like campus open days and lectures serve to showcase the K1 robot’s soccer capabilities and educate students on humanoid robotics and AI.

### Demonstration of Contributions
Our team will optimize the ball search logic to provide reproducible technical case references for subsequent leagues. This approach cuts ball search time, resolves collaborative tracking latency without direct communication, and provides a reproducible technical reference.

---

**Keywords:** Team Description, SPL Experience, K1 Development Plan.