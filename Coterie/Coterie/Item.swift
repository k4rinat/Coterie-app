//
//  Item.swift
//  Coterie
//
//  Created by Karina Tam on 4/3/2026.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
